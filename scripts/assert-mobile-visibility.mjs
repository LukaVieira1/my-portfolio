import { chromium } from "playwright";
import { spawn } from "child_process";
import { setTimeout as sleep } from "timers/promises";

const VIEWPORT = { width: 390, height: 844 };
const REQUIRED = [
  "Luka Vieira",
  "passionate about solving problems",
  "Front-End / Full-Stack Developer with 8 years",
  "product-driven environments",
  "JavaScript (ES6+)",
  "Murabei",
  "GetHub",
  "lukavieira14@gmail.com",
];

function startPreview(cwd, port) {
  const child = spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd, stdio: "ignore", detached: true },
  );
  child.unref();
  return child;
}

function stopPreview(child) {
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
}

async function prepare(page, port) {
  await page.addInitScript(() => {
    localStorage.setItem("i18nextLng", "en");
  });
  await page.goto(`http://127.0.0.1:${port}`, {
    waitUntil: "domcontentloaded",
    timeout: 25000,
  });
  await sleep(300);
  const skip = page.getByText("tap to skip");
  if (await skip.count()) {
    await skip.click();
  } else {
    await sleep(1600);
  }
  await page.waitForSelector("#about", { timeout: 20000 });
}

async function measureOverflow(page) {
  let max = 0;
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  for (let i = 0; i < 18; i++) {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    max = Math.max(max, width);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.65));
    await sleep(220);
  }
  return max;
}

function isVisibleOn(page, snippet) {
  return page.evaluate((needle) => {
    const vw = window.innerWidth;
    for (const el of document.querySelectorAll("body *")) {
      if (!(el instanceof HTMLElement)) continue;
      const text = (el.innerText || "").replace(/\s+/g, " ");
      if (!text.includes(needle)) continue;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      if (parseFloat(style.opacity || "1") < 0.15) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 && rect.height < 1) continue;
      if (el.scrollWidth > el.clientWidth + 8 && rect.right > vw + 8) continue;
      return { ok: true };
    }
    return { ok: false };
  }, snippet);
}

const branchPort = 4311;
const server = startPreview("/workspace", branchPort);
await sleep(4000);

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await prepare(page, branchPort);

  const scrollWidth = await measureOverflow(page);
  console.log("BRANCH max scrollWidth", scrollWidth);
  if (scrollWidth > VIEWPORT.width) {
    failures.push(`horizontal overflow: scrollWidth=${scrollWidth}`);
  }

  for (const snippet of REQUIRED) {
    await page.evaluate((text) => {
      const el = Array.from(document.querySelectorAll("body *")).find((node) =>
        (node.innerText || "").includes(text),
      );
      el?.scrollIntoView({ block: "center" });
    }, snippet);
    await sleep(350);
    const found = await isVisibleOn(page, snippet);
    if (!found.ok) failures.push(`missing or hidden: "${snippet}"`);
  }

  if (failures.length) {
    console.log("\nFAILED CHECKS");
    failures.forEach((item) => console.log(" -", item));
    process.exitCode = 1;
  } else {
    console.log("\nPASSED: no horizontal overflow; required content visible");
    process.exitCode = 0;
  }
} finally {
  await browser.close();
  stopPreview(server);
}
