import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { type, id, password } = await request.json()

    if (type === "employee") {
      // Query the employees table
      const employees = await sql<
        {
          employee_id: string
          name: string
          email: string
          mobile_number: string
          role: string
          department: string
          can_access_uptodate: boolean
        }[]
      >`
        SELECT employee_id, name, email, mobile_number, role, department, can_access_uptodate
        FROM employees
        WHERE employee_id = ${id} AND password = ${password}
      `

      if (employees.length === 0) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }

      const employee = employees[0]

      return NextResponse.json({
        success: true,
        user: {
          id: employee.employee_id,
          name: employee.name,
          email: employee.email,
          mobileNumber: employee.mobile_number,
          role: employee.role,
          department: employee.department,
          canAccessUptodate: employee.can_access_uptodate,
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid user type" }, { status: 400 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
