import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get all client entries from performance_entries table with employee names
    const allEntries = await sql<
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
        employee_name: string
      }[]
    >`
      SELECT 
        pe.id,
        pe.serial_number,
        pe.name,
        pe.email,
        pe.mobile_number,
        pe.address,
        pe.purpose,
        pe.employee_id,
        pe.date,
        pe.status,
        pe.notes,
        pe.image_url,
        COALESCE(a.name, e.name, 'Unknown Employee') as employee_name
      FROM performance_entries pe
      LEFT JOIN accounts a ON pe.employee_id = a.account_id
      LEFT JOIN employees e ON pe.employee_id = e.employee_id
      ORDER BY pe.date DESC, pe.serial_number ASC
    `

    return NextResponse.json(allEntries)
  } catch (error) {
    console.error("Error fetching all performance data:", error)
    return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
  }
}
