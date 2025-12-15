import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { wizardSchema } from '@/lib/schema/wizardSchema'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = wizardSchema.safeParse(json)

    if (!parsed.success) {
      return new NextResponse('Invalid payload', { status: 400 })
    }

    const { schoolName, schoolLocation, context } = parsed.data

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const { width, height } = page.getSize()
    const fontSize = 12

    let y = height - 50

    const drawLine = (label: string, value: string) => {
      page.drawText(`${label}: ${value}`, {
        x: 50,
        y,
        size: fontSize,
        font,
      })
      y -= 20
    }

    drawLine('School name', schoolName)
    drawLine('School location', schoolLocation)
    y -= 10
    page.drawText('Context:', { x: 50, y, size: fontSize, font })
    y -= 20

    // Naive wrapping (good enough for now)
    const maxChars = 90
    const lines = (context || '').match(new RegExp(`.{1,${maxChars}}`, 'g')) || ['']
    for (const line of lines) {
      if (y < 50) break
      page.drawText(line, { x: 50, y, size: fontSize, font })
      y -= 16
    }

    const bytes = await pdfDoc.save()

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="nse-report.pdf"',
      },
    })
  } catch {
    return new NextResponse('Server error generating PDF', { status: 500 })
  }
}
