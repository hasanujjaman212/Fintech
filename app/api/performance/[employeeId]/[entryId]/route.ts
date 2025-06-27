import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { employeeId: string; entryId: string } }) {
  try {
    const entryId = Number.parseInt(params.entryId)
    const employeeId = params.employeeId
    const entry = await request.json()

    console.log("Updating entry:", { entryId, employeeId, entry })

    if (isNaN(entryId)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 })
    }

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
        image_url: string
      }[]
    >`
      UPDATE performance_entries 
      SET 
        name = ${entry.name || ""},
        email = ${entry.email || ""},
        mobile_number = ${entry.mobileNumber || ""},
        address = ${entry.address || ""},
        purpose = ${entry.purpose || ""},
        status = ${entry.status || "pending"},
        notes = ${entry.notes || ""},
        image_url = ${entry.imageUrl || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${entryId} AND employee_id = ${employeeId}
      RETURNING id, serial_number, name, email, mobile_number, address, purpose, employee_id, date, status, notes, image_url
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found or access denied" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating performance entry:", error)
    return NextResponse.json(
      {
        error: "Failed to update performance entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { employeeId: string; entryId: string } }) {
  try {
    const entryId = Number.parseInt(params.entryId)
    const employeeId = params.employeeId

    const result = await sql`
      DELETE FROM performance_entries 
      WHERE id = ${entryId} AND employee_id = ${employeeId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting performance entry:", error)
    return NextResponse.json({ error: "Failed to delete performance entry" }, { status: 500 })
  }
}
