import { NextResponse } from 'next/server'
import { wizardSchema } from '@/lib/schema/wizardSchema'
import { renderPdf } from '@/lib/pdf/render'
import { generateHtmlTemplate } from '@/lib/pdf/template'

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']

function validateFile(file: File | null | undefined, fieldName: string): string | null {
  if (!file) return null

  if (file.size > MAX_FILE_SIZE) {
    return `${fieldName} exceeds maximum file size of 3MB`
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${fieldName} must be one of: PNG, JPG, WebP, or SVG`
  }

  return null
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Parse JSON data
    const dataStr = formData.get('data')
    if (!dataStr || typeof dataStr !== 'string') {
      return new NextResponse('Missing form data', { status: 400 })
    }

    let jsonData: unknown
    try {
      jsonData = JSON.parse(dataStr)
    } catch {
      return new NextResponse('Invalid JSON data', { status: 400 })
    }

    // Validate schema
    const parsed = wizardSchema.safeParse(jsonData)
    if (!parsed.success) {
      return new NextResponse(
        `Validation error: ${parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        { status: 400 }
      )
    }

    const data = parsed.data

    // Validate and process files
    const schoolLogoFile = formData.get('schoolLogo') as File | null
    const catchmentMapFile = formData.get('catchmentMap') as File | null

    const logoError = validateFile(schoolLogoFile, 'School logo')
    if (logoError) {
      return new NextResponse(logoError, { status: 400 })
    }

    const mapError = validateFile(catchmentMapFile, 'Catchment map')
    if (mapError) {
      return new NextResponse(mapError, { status: 400 })
    }

    // Convert files to base64 for embedding in PDF
    let schoolLogoBase64: string | undefined
    let catchmentMapBase64: string | undefined

    if (schoolLogoFile) {
      const arrayBuffer = await schoolLogoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      schoolLogoBase64 = `data:${schoolLogoFile.type};base64,${buffer.toString('base64')}`
    }

    if (catchmentMapFile) {
      const arrayBuffer = await catchmentMapFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      catchmentMapBase64 = `data:${catchmentMapFile.type};base64,${buffer.toString('base64')}`
    }

    // Generate HTML template
    const html = generateHtmlTemplate({
      ...data,
      schoolLogoBase64,
      catchmentMapBase64,
    })

    // Render PDF from HTML
    const pdfBytes = await renderPdf(html)

    // Generate filename
    const schoolName = data.schoolName || 'School'
    const admissionYear = data.admissionYear || 'Unknown'
    const sanitizedName = schoolName.replace(/[^a-z0-9]/gi, '_').substring(0, 50)
    const filename = `NSE_${sanitizedName}_${admissionYear.replace('/', '-')}.pdf`

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return new NextResponse(
      `Server error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}
