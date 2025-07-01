import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const entries = await sql<
      {
        id: number
        serial_number: number
        name: string
        email: string
        mobile_number: string
        address: string
        purpose: string
        employee_id: string
        date: string
        status: "pending" | "completed" | "in-progress"
        notes: string
        image_url: string
      }[]
    >`
      SELECT * FROM performance_entries 
      WHERE employee_id = ${params.employeeId}
      ORDER BY date DESC, serial_number DESC
    `

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching performance entries:", error)
    return NextResponse.json({ error: "Failed to fetch performance entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.mobileNumber || !data.address || !data.purpose) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Check for duplicate email
    const existingEntry = await sql`
      SELECT id FROM performance_entries WHERE email = ${data.email}
    `

    if (existingEntry.length > 0) {
      return NextResponse.json({ error: "A client with this email already exists" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO performance_entries (
        serial_number, name, email, mobile_number, address, purpose, 
        employee_id, date, status, notes, image_url
      ) VALUES (
        ${data.serialNumber}, ${data.name}, ${data.email}, ${data.mobileNumber},
        ${data.address}, ${data.purpose}, ${data.employeeId}, ${data.date},
        ${data.status}, ${data.notes || ""}, ${data.imageUrl || ""}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
