import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get all client interactions from all employees using correct table name
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
        status: "pending" | "completed" | "in-progress"
        notes: string
        image_url: string
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
        COALESCE(pe.image_url, '') as image_url,
        COALESCE(a.name, e.name, pe.employee_id) as employee_name
      FROM performance_entries pe
      LEFT JOIN employees e ON pe.employee_id = e.employee_id
      LEFT JOIN accounts a ON pe.employee_id = a.account_id
      ORDER BY pe.date DESC, pe.serial_number DESC
    `

    return NextResponse.json(allEntries)
  } catch (error) {
    console.error("Error fetching all performance data:", error)
    return NextResponse.json({ error: "Failed to fetch all performance data" }, { status: 500 })
  }
}
