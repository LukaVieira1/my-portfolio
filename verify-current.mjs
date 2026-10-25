import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const SCREENSHOTS_DIR = '/opt/cursor/artifacts/screenshots';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function captureSection(page, sectionId, filename, description) {
  console.log(`  📸 ${description}...`);
  
  await page.evaluate((id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, sectionId);
  
  await page.waitForTimeout(2000);
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: `${SCREENSHOTS_DIR}/${filename}`,
    fullPage: false 
  });
  
  console.log(`    ✓ Saved ${filename}`);
}

console.log('\n' + '='.repeat(60));
console.log('📱 VERIFYING: cursor/scroll-animations-93f7');
console.log('='.repeat(60));

try {
  console.log('\n🔨 Building...');
  execSync(`npm run build`, { stdio: 'inherit', cwd: '/workspace' });
  
  console.log('\n🚀 Starting preview server...');
  execSync(`npx vite preview --port 4174 > /tmp/vite-preview-after.log 2>&1 &`, { cwd: '/workspace' });
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
  await page.goto('http://localhost:4174', { 
    waitUntil: 'networkidle',
    timeout: 15000 
  });
  
  await page.waitForTimeout(3000);
  
  console.log('\n📸 Taking screenshots:\n');
  
  console.log('  📸 Hero section...');
  await page.screenshot({ 
    path: `${SCREENSHOTS_DIR}/AFTER-mobile-01-hero.png`,
    fullPage: false 
  });
  console.log('    ✓ Saved');
  
  await captureSection(page, '#about', 'AFTER-mobile-02-about.png', 'About section');
  await captureSection(page, '#experience', 'AFTER-mobile-03-experience.png', 'Experience section (TIMELINE CHECK)');
  await captureSection(page, '#projects', 'AFTER-mobile-04-projects.png', 'Projects section');
  await captureSection(page, '#contact', 'AFTER-mobile-05-contact.png', 'Contact section');
  
  console.log('\n  📸 Scrolling through entire page...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(500);
  }
  
  await page.waitForTimeout(2000);
  
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
    path: `${SCREENSHOTS_DIR}/AFTER-mobile-experience-final-check.png`,
    fullPage: false 
  });
  console.log('    ✓ Final timeline check saved');
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ VERIFICATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📁 Screenshots: ${SCREENSHOTS_DIR}\n`);
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
} finally {
  try {
    execSync(`pkill -f "vite preview"`, { stdio: 'ignore' });
  } catch (e) {
    // Ignore pkill errors
  }
}
