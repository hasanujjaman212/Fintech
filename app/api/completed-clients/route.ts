import { NextResponse } from "next/server"
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
      }[]
    >`
      SELECT id, original_entry_id, serial_number, name, email, mobile_number, 
             address, purpose, employee_id, employee_name, date, completion_date, notes
      FROM completed_clients
      ORDER BY completion_date DESC
    `

    return NextResponse.json(completedClients)
  } catch (error) {
    console.error("Error fetching completed clients:", error)
    return NextResponse.json({ error: "Failed to fetch completed clients" }, { status: 500 })
  }
}
