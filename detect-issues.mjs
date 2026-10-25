import { chromium } from 'playwright';
import { execSync } from 'child_process';

console.log('\n🔍 DETECTING ANIMATION ISSUES...\n');

execSync(`npm run build`, { stdio: 'inherit', cwd: '/workspace' });
execSync(`npx vite preview --port 4175 > /tmp/vite-detect.log 2>&1 &`, { cwd: '/workspace' });
await new Promise(resolve => setTimeout(resolve, 5000));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 3,
});

const page = await context.newPage();

// Listen for console errors
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    errors.push(`[${msg.type()}] ${msg.text()}`);
  }
});

await page.goto('http://localhost:4175', { 
  waitUntil: 'networkidle',
  timeout: 15000 
});

await page.waitForTimeout(3000);

console.log('✅ Page loaded\n');

// Check for elements stuck in partial opacity/scale
async function checkStuckElements(sectionName, selector) {
  console.log(`🔍 Checking ${sectionName}...`);
  
  const stuck = await page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    const issues = [];
    
    elements.forEach((el, idx) => {
      const style = window.getComputedStyle(el);
      const opacity = parseFloat(style.opacity);
      const transform = style.transform;
      
      // Check for partial opacity (not 0 or 1)
      if (opacity > 0.1 && opacity < 0.95) {
        issues.push({
          element: `${sel}[${idx}]`,
          opacity,
          transform,
          problem: 'Stuck at partial opacity'
        });
      }
      
      // Check for scale in transform
      if (transform !== 'none') {
        const match = transform.match(/matrix\(([^,]+),/);
        if (match) {
          const scale = parseFloat(match[1]);
          if (scale > 0.1 && scale < 0.98) {
            issues.push({
              element: `${sel}[${idx}]`,
              scale,
              transform,
              problem: 'Stuck at partial scale'
            });
          }
        }
      }
    });
    
    return issues;
  }, selector);
  
  if (stuck.length > 0) {
    console.log(`  ❌ Found ${stuck.length} stuck elements:`);
    stuck.forEach(s => console.log(`    - ${s.element}: ${s.problem} (${s.opacity || s.scale})`));
  } else {
    console.log(`  ✅ No stuck elements`);
  }
  
  return stuck;
}

// Scroll to each section and check
const sections = [
  { id: '#about', name: 'About', selector: '#about' },
  { id: '#experience', name: 'Experience', selector: '.relative.space-y-12 > div' },
  { id: '#projects', name: 'Projects', selector: '#projects' },
];

const allIssues = [];

for (const section of sections) {
  await page.evaluate((id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, section.id);
  
  await page.waitForTimeout(3000);
  
  const issues = await checkStuckElements(section.name, section.selector);
  allIssues.push(...issues);
}

console.log('\n' + '='.repeat(60));

if (allIssues.length > 0) {
  console.log(`❌ FOUND ${allIssues.length} ANIMATION ISSUES`);
} else {
  console.log('✅ NO STUCK ANIMATIONS DETECTED');
}

if (errors.length > 0) {
  console.log('\n⚠️  Console errors/warnings:');
  errors.forEach(e => console.log(`  ${e}`));
} else {
  console.log('✅ No console errors');
}

console.log('='.repeat(60) + '\n');

await browser.close();
execSync(`pkill -f "vite preview"`, { stdio: 'ignore' });

process.exit(allIssues.length > 0 ? 1 : 0);
