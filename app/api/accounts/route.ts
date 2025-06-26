import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const accounts = await sql<
      {
        id: number
        account_id: string
        name: string
        email: string
        mobile_number: string
        password: string
        account_type: string
        role: string
        department: string
        can_access_uptodate: boolean
        industry: string
        portfolio_value: number
        risk_profile: string
        account_manager_id: string
        is_active: boolean
        created_at: string
      }[]
    >`
      SELECT * FROM accounts ORDER BY created_at DESC
    `

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ message: "Error fetching accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const result = await sql`
      INSERT INTO accounts (
        account_id, name, email, mobile_number, password, account_type,
        role, department, can_access_uptodate, industry, portfolio_value,
        risk_profile, account_manager_id, is_active
      ) VALUES (
        ${data.account_id}, ${data.name}, ${data.email}, ${data.mobile_number},
        ${data.password}, ${data.account_type}, ${data.role || null},
        ${data.department || null}, ${data.can_access_uptodate || false},
        ${data.industry || null}, ${data.portfolio_value || null},
        ${data.risk_profile || null}, ${data.account_manager_id || null},
        ${data.is_active}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error creating account:", error)
    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ message: "Account ID or email already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Error creating account" }, { status: 500 })
  }
}
