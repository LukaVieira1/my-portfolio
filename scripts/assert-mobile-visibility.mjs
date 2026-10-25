import { chromium } from "playwright";
import { spawn } from "child_process";
import { setTimeout as sleep } from "timers/promises";

const VIEWPORT = { width: 390, height: 844 };
const REQUIRED = [
  "Hi, my name is",
  "Luka Vieira.",
  "I'm passionate about solving problems",
  "About",
  "About Me",
  "Front-End / Full-Stack Developer with 8 years",
  "product-driven environments",
  "Main technologies I work with",
  "8+",
  "5+",
  "Years in IT",
  "Years Dev",
  "Where I've Worked",
  "Some Things I've Built",
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
    waitUntil: "networkidle",
    timeout: 25000,
  });
  await page.waitForSelector("#about", { timeout: 20000 });
  await sleep(1500);
}

async function scrollThrough(page) {
  const snippets = new Set();
  const overflowing = [];
  let maxScrollWidth = 0;

  const stops = [null, "#about", "#experience", "#projects", "#contact"];
  for (const sel of stops) {
    if (sel) {
      await page.evaluate((id) => {
        document.querySelector(id)?.scrollIntoView({ block: "start" });
      }, sel);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await sleep(1100);
    const shot = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const texts = [];
      const overflowing = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const el = walker.currentNode;
        if (!(el instanceof HTMLElement)) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const opacity = parseFloat(style.opacity || "1");
        if (opacity < 0.95) continue;
        const rect = el.getBoundingClientRect();
        const inViewport =
          rect.bottom > 8 && rect.top < vh - 8 && rect.right > 0 && rect.left < vw;
        if (!inViewport) continue;
        if (el.scrollWidth > el.clientWidth + 2 && rect.right > vw + 2) {
          overflowing.push({
            tag: el.tagName,
            text: (el.innerText || "").slice(0, 50),
          });
        }
        const section = el.closest("section")?.id || el.closest("nav")?.tagName || "hero";
        if (section === "projects") continue;
        const own = Array.from(el.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent || "").replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join(" ");
        if (own.length >= 8 && own.length <= 90) texts.push(own);
      }
      return {
        scrollWidth: document.documentElement.scrollWidth,
        overflowing,
        texts,
      };
    });
    maxScrollWidth = Math.max(maxScrollWidth, shot.scrollWidth);
    overflowing.push(...shot.overflowing);
    shot.texts.forEach((t) => snippets.add(t));
  }

  return { maxScrollWidth, overflowing, texts: [...snippets] };
}

function isVisibleOn(page, snippet) {
  return page.evaluate((needle) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nodes = Array.from(document.querySelectorAll("body *"));
    for (const el of nodes) {
      if (!(el instanceof HTMLElement)) continue;
      const text = (el.innerText || "").replace(/\s+/g, " ");
      if (!text.includes(needle)) continue;
      const style = getComputedStyle(el);
      const opacity = parseFloat(style.opacity || "1");
      if (style.display === "none" || style.visibility === "hidden" || opacity < 0.95) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      if (rect.right > vw + 2 && el.scrollWidth > el.clientWidth + 2) continue;
      const inPage = rect.bottom > 0 && rect.top < document.documentElement.scrollHeight;
      if (inPage) {
        return {
          ok: true,
          opacity,
          top: Math.round(rect.top),
          height: Math.round(rect.height),
          inViewport: rect.bottom > 0 && rect.top < vh,
        };
      }
    }
    return { ok: false };
  }, snippet);
}

const mainPort = 4310;
const branchPort = 4311;
const mainServer = startPreview("/tmp/main-portfolio", mainPort);
const branchServer = startPreview("/workspace", branchPort);
await sleep(4000);

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  const mainCtx = await browser.newContext({
    viewport: VIEWPORT,
    hasTouch: true,
    isMobile: true,
  });
  const branchCtx = await browser.newContext({
    viewport: VIEWPORT,
    hasTouch: true,
    isMobile: true,
  });
  const mainPage = await mainCtx.newPage();
  const branchPage = await branchCtx.newPage();

  await prepare(mainPage, mainPort);
  await prepare(branchPage, branchPort);

  const mainMetrics = await scrollThrough(mainPage);
  const branchMetrics = await scrollThrough(branchPage);

  console.log("MAIN max scrollWidth", mainMetrics.maxScrollWidth);
  console.log("BRANCH max scrollWidth", branchMetrics.maxScrollWidth);

  if (branchMetrics.maxScrollWidth > VIEWPORT.width) {
    failures.push(
      `horizontal overflow: scrollWidth=${branchMetrics.maxScrollWidth} (must be ${VIEWPORT.width})`,
    );
  }
  if (branchMetrics.overflowing.length) {
    failures.push(
      `clipped/overflowing nodes: ${JSON.stringify(branchMetrics.overflowing.slice(0, 5))}`,
    );
  }

  const mainSnippets = mainMetrics.texts.filter((t) => t.length >= 8).slice(0, 80);

  for (const snippet of [...REQUIRED, ...mainSnippets]) {
    const foundMain = await isVisibleOn(mainPage, snippet);
    if (!foundMain.ok && !REQUIRED.includes(snippet)) continue;

    await branchPage.evaluate((text) => {
      const el = Array.from(document.querySelectorAll("body *")).find((node) =>
        (node.innerText || "").includes(text),
      );
      el?.scrollIntoView({ block: "center" });
    }, snippet);
    await sleep(400);

    const foundBranch = await isVisibleOn(branchPage, snippet);
    if (!foundBranch.ok) {
      failures.push(`missing or hidden on branch: "${snippet.slice(0, 70)}"`);
    }
  }

  if (failures.length) {
    console.log("\nFAILED CHECKS");
    for (const item of failures) console.log(" -", item);
    process.exitCode = 1;
  } else {
    console.log("\nPASSED: no horizontal overflow; required main texts visible on branch");
    process.exitCode = 0;
  }
} finally {
  await browser.close();
  stopPreview(mainServer);
  stopPreview(branchServer);
}
