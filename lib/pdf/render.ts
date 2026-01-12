// Use playwright-core with browser-chromium for Vercel compatibility
import { chromium } from 'playwright-core'

// For Vercel/serverless: use lightweight browser-chromium package
// For local dev: falls back to system Playwright if available
let chromiumExecutablePath: string | undefined

try {
  // Try to import browser-chromium (for Vercel)
  const browserChromium = require('@playwright/browser-chromium')
  chromiumExecutablePath = browserChromium.executablePath()
} catch {
  // Fallback: use system Playwright (for local dev)
  // This will use the Chromium installed by `npx playwright install chromium`
  chromiumExecutablePath = undefined
}

export async function renderPdf(html: string): Promise<Buffer> {
  let browser
  try {
    // Launch browser in headless mode
    // For Vercel: uses @playwright/browser-chromium (lightweight)
    // For local: uses system Playwright Chromium
    const launchOptions: Parameters<typeof chromium.launch>[0] = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for Vercel/serverless environments
    }

    if (chromiumExecutablePath) {
      launchOptions.executablePath = chromiumExecutablePath
    }

    browser = await chromium.launch(launchOptions)

    const page = await browser.newPage()

    // Set content and wait for it to load
    await page.setContent(html, {
      waitUntil: 'networkidle',
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      printBackground: true,
      preferCSSPageSize: false,
    })

    return Buffer.from(pdfBuffer)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

