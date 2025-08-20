import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const employeeId = formData.get("employeeId") as string
    const entryId = formData.get("entryId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPEG, PNG, GIF, or WebP images." },
        { status: 400 },
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${employeeId}-${entryId || "new"}-${timestamp}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({ imageUrl: blob.url })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
