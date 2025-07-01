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
      ORDER BY serial_number DESC
    `

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching performance entries:", error)
    return NextResponse.json({ error: "Failed to fetch performance entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const employeeIdFromUrl = params.employeeId
    const entry = await request.json()

    console.log("Creating new entry with data:", { employeeIdFromUrl, entry });
    
    // Deconstruct with snake_case to match the incoming JSON body
    const {
      serial_number,
      name,
      email,
      mobile_number,
      address,
      purpose,
      date,
      status,
      notes
    } = entry;

    // Server-side validation
    if (!serial_number || !name || !email || !mobile_number || !address || !purpose || !date || !status) {
        return NextResponse.json({ error: "Missing one or more required fields" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO performance_entries (
        serial_number, name, email, mobile_number, address, purpose, employee_id, date, status, notes
      ) VALUES (
        ${serial_number}, 
        ${name}, 
        ${email}, 
        ${mobile_number}, 
        ${address}, 
        ${purpose}, 
        ${employeeIdFromUrl}, 
        ${date}, 
        ${status}, 
        ${notes || null}
      )
      RETURNING *;
    `
    // The result from Vercel Postgres is in `result.rows[0]`
    const newEntry = result.rows[0]

    if (!newEntry) {
        throw new Error("Database insertion failed to return the new entry.");
    }

    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error("Error creating performance entry:", error)
    return NextResponse.json(
      {
        error: "Failed to create performance entry",
        details: error instanceof Error ? error.message : "An unknown server error occurred.",
      },
      { status: 500 },
    )
  }
}
