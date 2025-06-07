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
        address: string
        purpose: string
        employee_id: string
        date: string
        status: string
        notes: string
      }[]
    >`
      SELECT id, serial_number, name, email, address, purpose, employee_id, date, status, notes
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

export async function POST(request: NextRequest) {
  try {
    const entry = await request.json()

    const result = await sql<{ id: number }[]>`
      INSERT INTO performance_entries (
        serial_number, name, email, address, purpose, employee_id, date, status, notes
      ) VALUES (
        ${entry.serialNumber}, ${entry.name}, ${entry.email}, ${entry.address}, 
        ${entry.purpose}, ${entry.employeeId}, ${entry.date}, ${entry.status}, ${entry.notes}
      )
      RETURNING id
    `

    return NextResponse.json({ ...entry, id: result[0].id })
  } catch (error) {
    console.error("Error creating performance entry:", error)
    return NextResponse.json({ error: "Failed to create performance entry" }, { status: 500 })
  }
}
