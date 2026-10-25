import { chromium, webkit, devices } from "playwright";
import { spawn } from "child_process";
import { mkdirSync } from "fs";
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
const TARGET = process.env.PREVIEW_URL || "";
const SHOTS = "/opt/cursor/artifacts/screenshots";
mkdirSync(SHOTS, { recursive: true });

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
  if (!child) return;
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

function disableWebGL(page) {
  return page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype;
    const original = proto.getContext;
    proto.getContext = function (type, ...args) {
      if (String(type).toLowerCase().includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
}

async function gotoFresh(page, url) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("i18nextLng", "en");
    } catch {
      /* ignore */
    }
  });
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  return res;
}

function heroVisible(page) {
  return page.evaluate(() => {
    const heading = document.querySelector("h1");
    if (!heading) return { ok: false, reason: "no h1" };
    const text = (heading.innerText || "").replace(/\s+/g, " ");
    if (!text.includes("Luka Vieira")) return { ok: false, reason: `h1="${text}"` };
    const style = getComputedStyle(heading);
    if (style.display === "none" || style.visibility === "hidden") {
      return { ok: false, reason: "hidden" };
    }
    if (parseFloat(style.opacity || "1") < 0.2) return { ok: false, reason: `opacity ${style.opacity}` };
    const rect = heading.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return { ok: false, reason: "zero size" };
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      return { ok: false, reason: "offscreen" };
    }
    return { ok: true, text, top: rect.top, height: rect.height };
  });
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

async function measureOverflow(page) {
  let max = 0;
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  for (let i = 0; i < 16; i++) {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    max = Math.max(max, width);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.7));
    await sleep(160);
  }
  return max;
}

async function runCase({ browserType, label, contextOpts, url, webgl = true, shots = false }) {
  const failures = [];
  const errors = [];
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    ...contextOpts,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => errors.push(err.message));
  if (!webgl) await disableWebGL(page);

  try {
    const res = await gotoFresh(page, url);
    if (!res || res.status() >= 400) {
      failures.push(`${label}: HTTP ${res?.status()}`);
    }

    await sleep(1000);
    if (shots) await page.screenshot({ path: `${SHOTS}/${label}-1s.png` });
    await sleep(2000);
    if (shots) await page.screenshot({ path: `${SHOTS}/${label}-3s.png` });
    const at3 = await heroVisible(page);
    if (!at3.ok) failures.push(`${label}: hero not visible at 3s (${at3.reason})`);
    const hasAbout = await page.evaluate(() => !!document.querySelector("#about"));
    if (!hasAbout) failures.push(`${label}: #about missing after load (React tree crashed)`);
    await sleep(3000);
    if (shots) await page.screenshot({ path: `${SHOTS}/${label}-6s.png` });
    const at6 = await heroVisible(page);
    if (!at6.ok) failures.push(`${label}: hero not visible at 6s (${at6.reason})`);

    if (errors.length) {
      failures.push(`${label}: pageerror ${errors.join(" | ")}`);
    }

    const skip = page.getByText("tap to skip");
    if (await skip.count()) await skip.click().catch(() => {});
    await page.waitForSelector("#about", { timeout: 12000 });
    const fallbackOnly = await page.evaluate(() => !document.querySelector("#about") && !!document.querySelector("h1"));
    if (fallbackOnly) failures.push(`${label}: crashed to static fallback`);

    if (label.includes("webkit") || label.includes("iphone")) {
      const scrollWidth = await measureOverflow(page);
      console.log(label, "scrollWidth", scrollWidth);
      if (scrollWidth > VIEWPORT.width) {
        failures.push(`${label}: horizontal overflow ${scrollWidth}`);
      }
    }

    for (const snippet of REQUIRED) {
      await page.evaluate((text) => {
        const el = Array.from(document.querySelectorAll("body *")).find((node) =>
          (node.innerText || "").includes(text),
        );
        el?.scrollIntoView({ block: "center" });
      }, snippet);
      await sleep(250);
      const found = await isVisibleOn(page, snippet);
      if (!found.ok) failures.push(`${label}: missing or hidden "${snippet}"`);
    }
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
  } finally {
    await browser.close();
  }

  return failures;
}

const port = 4311;
const localUrl = `http://127.0.0.1:${port}`;
const server = TARGET ? null : startPreview("/workspace", port);
if (!TARGET) await sleep(4000);
const url = TARGET || localUrl;

const failures = [];
try {
  failures.push(
    ...(await runCase({
      browserType: webkit,
      label: "webkit-iphone",
      contextOpts: { ...devices["iPhone 13"] },
      url,
      shots: Boolean(TARGET),
    })),
  );
  failures.push(
    ...(await runCase({
      browserType: chromium,
      label: "chromium-desktop",
      contextOpts: { viewport: { width: 1440, height: 900 } },
      url,
      shots: Boolean(TARGET),
    })),
  );
  failures.push(
    ...(await runCase({
      browserType: chromium,
      label: "chromium-nowebgl",
      contextOpts: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
      url,
      webgl: false,
    })),
  );
} finally {
  stopPreview(server);
}

if (failures.length) {
  console.log("\nFAILED CHECKS");
  failures.forEach((item) => console.log(" -", item));
  process.exitCode = 1;
} else {
  console.log("\nPASSED: hero visible after load on WebKit + Chromium; WebGL-off still readable");
  process.exitCode = 0;
}
