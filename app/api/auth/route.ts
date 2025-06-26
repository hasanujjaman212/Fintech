import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { type, id, password } = await request.json()

    if (type === "employee") {
      // First check if accounts table exists and query it
      let accountUser = null
      try {
        const accounts = await sql<
          {
            account_id: string
            name: string
            email: string
            mobile_number: string
            role: string
            department: string
            can_access_uptodate: boolean
            account_type: string
          }[]
        >`
          SELECT account_id, name, email, mobile_number, role, department, can_access_uptodate, account_type
          FROM accounts
          WHERE account_id = ${id} AND password = ${password} AND account_type IN ('admin', 'employee')
        `

        if (accounts.length > 0) {
          accountUser = accounts[0]
        }
      } catch (error) {
        // accounts table doesn't exist yet, continue with employees table
        console.log("Accounts table not found, using employees table")
      }

      // If found in accounts table, return that user
      if (accountUser) {
        return NextResponse.json({
          success: true,
          user: {
            id: accountUser.account_id,
            name: accountUser.name,
            email: accountUser.email,
            mobileNumber: accountUser.mobile_number,
            role: accountUser.role,
            department: accountUser.department,
            canAccessUptodate: accountUser.can_access_uptodate,
            accountType: accountUser.account_type,
          },
        })
      }

      // Fallback to employees table
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
          accountType: "employee",
        },
      })
    }

    if (type === "client") {
      // Try to query accounts table for clients
      try {
        const clients = await sql<
          {
            account_id: string
            name: string
            email: string
            mobile_number: string
            industry: string
            portfolio_value: number
            risk_profile: string
            account_manager_id: string
          }[]
        >`
          SELECT account_id, name, email, mobile_number, industry, portfolio_value, risk_profile, account_manager_id
          FROM accounts
          WHERE account_id = ${id} AND password = ${password} AND account_type = 'client'
        `

        if (clients.length === 0) {
          return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
        }

        const client = clients[0]
        return NextResponse.json({
          success: true,
          user: {
            id: client.account_id,
            name: client.name,
            email: client.email,
            mobileNumber: client.mobile_number,
            industry: client.industry,
            portfolioValue: client.portfolio_value,
            riskProfile: client.risk_profile,
            accountManagerId: client.account_manager_id,
          },
        })
      } catch (error) {
        // accounts table doesn't exist
        return NextResponse.json(
          { success: false, message: "Client login not available yet. Please contact administrator." },
          { status: 400 },
        )
      }
    }

    return NextResponse.json({ success: false, message: "Invalid user type" }, { status: 400 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
