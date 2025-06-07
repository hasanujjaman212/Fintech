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
          role: string
          department: string
          can_access_uptodate: boolean
        }[]
      >`
        SELECT employee_id, name, email, role, department, can_access_uptodate
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
          role: employee.role,
          department: employee.department,
          canAccessUptodate: employee.can_access_uptodate,
        },
      })
    } else if (type === "client") {
      // Query the clients table
      const clients = await sql<
        {
          client_id: string
          name: string
          email: string
          industry: string
          account_manager_id: string
          portfolio_value: number
          risk_profile: string
        }[]
      >`
        SELECT client_id, name, email, industry, account_manager_id, portfolio_value, risk_profile
        FROM clients
        WHERE client_id = ${id} AND password = ${password}
      `

      if (clients.length === 0) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }

      const client = clients[0]

      return NextResponse.json({
        success: true,
        user: {
          id: client.client_id,
          name: client.name,
          email: client.email,
          industry: client.industry,
          accountManagerId: client.account_manager_id,
          portfolioValue: client.portfolio_value,
          riskProfile: client.risk_profile,
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid user type" }, { status: 400 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
