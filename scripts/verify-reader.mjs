import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const baseUrl = process.env.READER_URL || "http://localhost:4173";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--autoplay-policy=no-user-gesture-required"],
});

async function verifyViewport(name, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(() => {
    const speechMock = {
      getVoices: () => [],
      speak: () => undefined,
      cancel: () => undefined,
      pause: () => undefined,
      resume: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speechMock });
  });
  await page.goto(`${baseUrl}/learn?qa=${name}-${Date.now()}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.removeItem("under-progress-reading-tools"));
  await page.reload({ waitUntil: "networkidle0" });

  const initial = await page.$eval('[data-testid="reader-paragraph"]', element => ({
    fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
    lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
  }));
  await page.click('[data-testid="text-size-extra-large"]');
  const largerFont = await page.$eval('[data-testid="reader-paragraph"]', element => Number.parseFloat(getComputedStyle(element).fontSize));
  assert(largerFont > initial.fontSize, `${name}: extra-large text did not increase font size`);

  await page.click('[data-testid="spacing-relaxed"]');
  const relaxedLineHeight = await page.$eval('[data-testid="reader-paragraph"]', element => Number.parseFloat(getComputedStyle(element).lineHeight));
  assert(relaxedLineHeight > initial.lineHeight, `${name}: relaxed spacing did not increase line height`);

  await page.click('[data-testid="contrast-toggle"]');
  const contrastBackground = await page.$eval('[data-testid="reader-surface"]', element => getComputedStyle(element).backgroundColor);
  assert.equal(contrastBackground, "rgb(16, 24, 32)", `${name}: contrast did not change reader surface`);

  await page.click('[data-testid="focus-toggle"]');
  assert(await page.$('[data-testid="focus-frame"]'), `${name}: focus frame did not appear`);

  await page.click('[data-testid="read-aloud"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="speech-status"]')?.textContent?.includes("Reading aloud"));
  await page.waitForSelector('[data-testid="pause-resume"]');
  assert(await page.$('[data-testid="pause-resume"]'), `${name}: pause control did not appear`);
  await page.click('[data-testid="pause-resume"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="speech-status"]')?.textContent?.includes("paused"));
  await page.click('[data-testid="pause-resume"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="speech-status"]')?.textContent?.includes("Reading aloud again"));

  await page.reload({ waitUntil: "networkidle0" });
  const persisted = await page.evaluate(() => localStorage.getItem("under-progress-reading-tools"));
  assert(persisted?.includes("Extra large") && persisted.includes("Relaxed") && persisted.includes("true"), `${name}: reader preferences did not persist`);
  await page.close();
  return `${name}: text, spacing, contrast, focus, read-aloud pause, and persistence passed`;
}

try {
  const results = [];
  results.push(await verifyViewport("desktop", { width: 1280, height: 720 }));
  results.push(await verifyViewport("mobile", { width: 390, height: 844, isMobile: true, hasTouch: true }));
  console.log(results.join("\n"));
} finally {
  await browser.close();
}
