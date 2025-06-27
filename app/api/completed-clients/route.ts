import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // First check if the completed_clients table exists
    const tableExists = await sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'completed_clients'
      ) as exists
    `

    if (!tableExists[0]?.exists) {
      console.log("completed_clients table does not exist yet")
      return NextResponse.json([])
    }

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
      SELECT id, original_entry_id, serial_number, name, email, mobile_number, 
             address, purpose, employee_id, employee_name, date, completion_date, notes,
             COALESCE(image_url, '') as image_url
      FROM completed_clients
      ORDER BY completion_date DESC
    `

    return NextResponse.json(completedClients)
  } catch (error) {
    console.error("Error fetching completed clients:", error)
    return NextResponse.json({ error: "Failed to fetch completed clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      originalEntryId,
      serialNumber,
      name,
      email,
      mobileNumber,
      address,
      purpose,
      employeeId,
      employeeName,
      date,
      notes,
      imageUrl,
    } = body

    console.log("Adding completed client:", body)

    // Check if the completed_clients table exists
    const tableExists = await sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'completed_clients'
      ) as exists
    `

    if (!tableExists[0]?.exists) {
      console.error("completed_clients table does not exist")
      return NextResponse.json({ error: "Database not properly set up. Please run the setup script." }, { status: 500 })
    }

    const result = await sql<
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
      INSERT INTO completed_clients (
        original_entry_id, serial_number, name, email, mobile_number, 
        address, purpose, employee_id, employee_name, date, completion_date, notes, image_url
      ) VALUES (
        ${originalEntryId}, ${serialNumber}, ${name}, ${email}, ${mobileNumber},
        ${address}, ${purpose}, ${employeeId}, ${employeeName}, ${date}, 
        CURRENT_TIMESTAMP, ${notes || ""}, ${imageUrl || ""}
      )
      RETURNING id, original_entry_id, serial_number, name, email, mobile_number, 
               address, purpose, employee_id, employee_name, date, completion_date, notes, image_url
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error adding completed client:", error)
    return NextResponse.json(
      {
        error: "Failed to add completed client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
