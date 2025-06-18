import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const employeeId = params.employeeId

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
        status: string
        notes: string
      }[]
    >`
      SELECT id, serial_number, name, email, mobile_number, address, purpose, employee_id, date, status, notes
      FROM performance_entries
      WHERE employee_id = ${employeeId}
      ORDER BY date DESC
    `

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching performance entries:", error)
    return NextResponse.json({ error: "Failed to fetch performance entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const employeeId = params.employeeId
    const entry = await request.json()

    console.log("Creating entry:", { employeeId, entry })

    const result = await sql<
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
        status: string
        notes: string
      }[]
    >`
      INSERT INTO performance_entries (
        serial_number, name, email, mobile_number, address, purpose, employee_id, date, status, notes
      ) VALUES (
        ${entry.serialNumber || 1}, 
        ${entry.name || ""}, 
        ${entry.email || ""}, 
        ${entry.mobileNumber || ""}, 
        ${entry.address || ""}, 
        ${entry.purpose || ""}, 
        ${employeeId}, 
        ${entry.date || new Date().toISOString().split("T")[0]}, 
        ${entry.status || "pending"}, 
        ${entry.notes || ""}
      )
      RETURNING id, serial_number, name, email, mobile_number, address, purpose, employee_id, date, status, notes
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating performance entry:", error)
    return NextResponse.json(
      {
        error: "Failed to create performance entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
