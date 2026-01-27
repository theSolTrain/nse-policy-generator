import { chromium } from 'playwright'

export async function renderPdf(html: string): Promise<Buffer> {
  let browser
  try {
    // Launch browser in headless mode
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for containerized environments
    })

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

