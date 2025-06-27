import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { employeeId: string; entryId: string } }) {
  try {
    const data = await request.json()
    const entryId = Number.parseInt(params.entryId)

    const result = await sql`
      UPDATE performance_entries SET
        name = ${data.name},
        email = ${data.email},
        mobile_number = ${data.mobileNumber},
        address = ${data.address},
        purpose = ${data.purpose},
        employee_id = ${data.employeeId},
        status = ${data.status},
        notes = ${data.notes || ""},
        image_url = ${data.imageUrl || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${entryId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating entry:", error)
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { employeeId: string; entryId: string } }) {
  try {
    const entryId = Number.parseInt(params.entryId)

    const result = await sql`
      DELETE FROM performance_entries WHERE id = ${entryId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting entry:", error)
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
  }
}
