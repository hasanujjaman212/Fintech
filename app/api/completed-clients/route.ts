import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const completedClients = await sql<
      {
        id: number
        original_entry_id: number
        serial_number: number
        name: string
        email: string
        mobile_number: string
        address: string
        purpose: string
        employee_id: string
        employee_name: string
        date: string
        completion_date: string
        notes: string
        image_url: string
      }[]
    >`
      SELECT * FROM completed_clients 
      ORDER BY completion_date DESC, id DESC
    `

    return NextResponse.json(completedClients)
  } catch (error) {
    console.error("Error fetching completed clients:", error)
    return NextResponse.json({ error: "Failed to fetch completed clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const result = await sql`
      INSERT INTO completed_clients (
        original_entry_id, serial_number, name, email, mobile_number, 
        address, purpose, employee_id, employee_name, date, notes, image_url
      ) VALUES (
        ${data.originalEntryId}, ${data.serialNumber}, ${data.name}, ${data.email},
        ${data.mobileNumber}, ${data.address}, ${data.purpose}, ${data.employeeId},
        ${data.employeeName}, ${data.date}, ${data.notes || ""}, ${data.imageUrl || ""}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating completed client:", error)
    return NextResponse.json({ error: "Failed to create completed client record" }, { status: 500 })
  }
}
