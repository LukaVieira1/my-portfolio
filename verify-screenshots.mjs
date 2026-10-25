import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const SCREENSHOTS_DIR = '/opt/cursor/artifacts/screenshots';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function captureSection(page, sectionId, filename, description) {
  console.log(`  📸 ${description}...`);
  
  // Scroll to section using smooth scroll
  await page.evaluate((id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, sectionId);
  
  // Wait for scroll to complete
  await page.waitForTimeout(2000);
  
  // Additional wait for any scroll-triggered animations
  await page.waitForTimeout(2000);
  
  // Screenshot
  await page.screenshot({ 
    path: `${SCREENSHOTS_DIR}/${filename}`,
    fullPage: false 
  });
  
  console.log(`    ✓ Saved ${filename}`);
}

async function verifyBranch(branch, prefix) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📱 VERIFYING: ${branch}`);
  console.log('='.repeat(60));
  
  try {
    // Checkout and build
    execSync(`git stash || true`, { stdio: 'ignore' });
    execSync(`git checkout ${branch}`, { stdio: 'inherit', cwd: '/workspace' });
    console.log('\n🔨 Building...');
    execSync(`npm run build`, { stdio: 'inherit', cwd: '/workspace' });
    
    // Start server
    console.log('\n🚀 Starting preview server...');
    const serverProcess = execSync(`npx vite preview --port 4173 > /tmp/vite-preview.log 2>&1 &`, { cwd: '/workspace' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: MOBILE_VIEWPORT,
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 3,
    });
    
    const page = await context.newPage();
    
    console.log('\n📱 Loading page...');
    await page.goto('http://localhost:4173', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait for initial load and animations
    await page.waitForTimeout(3000);
    
    console.log('\n📸 Taking screenshots:\n');
    
    // Hero (initial state)
    console.log('  📸 Hero section...');
    await page.screenshot({ 
      path: `${SCREENSHOTS_DIR}/${prefix}-mobile-01-hero.png`,
      fullPage: false 
    });
    console.log('    ✓ Saved');
    
    // About section
    await captureSection(page, '#about', `${prefix}-mobile-02-about.png`, 'About section');
    
    // Experience section - THE CRITICAL ONE
    await captureSection(page, '#experience', `${prefix}-mobile-03-experience.png`, 'Experience section (TIMELINE CHECK)');
    
    // Projects section
    await captureSection(page, '#projects', `${prefix}-mobile-04-projects.png`, 'Projects section');
    
    // Contact section
    await captureSection(page, '#contact', `${prefix}-mobile-05-contact.png`, 'Contact section');
    
    // Full page scroll to bottom
    console.log('\n  📸 Scrolling through entire page...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Simulate real scroll with touch
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(2000);
    
    // Go back to experience for detailed check
    console.log('\n  🔍 Final verification of Experience timeline...');
    await page.evaluate(() => {
      const exp = document.querySelector('#experience');
      if (exp) {
        window.scrollTo({ 
          top: exp.offsetTop - 100, 
          behavior: 'smooth' 
        });
      }
    });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: `${SCREENSHOTS_DIR}/${prefix}-mobile-experience-final-check.png`,
      fullPage: false 
    });
    console.log('    ✓ Final timeline check saved');
    
    await browser.close();
    
    console.log(`\n✅ ${branch} verification complete!\n`);
    
  } catch (error) {
    console.error(`\n❌ Error verifying ${branch}:`, error.message);
    throw error;
  } finally {
    execSync(`pkill -f "vite preview" || true`, { stdio: 'ignore' });
  }
}

(async () => {
  try {
    // Verify main first
    await verifyBranch('main', 'BEFORE');
    
    // Then verify our branch
    await verifyBranch('cursor/scroll-animations-93f7', 'AFTER');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL VERIFICATIONS COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📁 Screenshots saved to: ${SCREENSHOTS_DIR}\n`);
    
    // Return to our branch
    execSync(`git checkout cursor/scroll-animations-93f7`, { stdio: 'inherit', cwd: '/workspace' });
    execSync(`git stash pop || true`, { stdio: 'ignore' });
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
})();
