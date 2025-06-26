import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const id = Number.parseInt(params.id)

    const result = await sql`
      UPDATE accounts SET
        account_id = ${data.account_id},
        name = ${data.name},
        email = ${data.email},
        mobile_number = ${data.mobile_number},
        password = ${data.password},
        account_type = ${data.account_type},
        role = ${data.role || null},
        department = ${data.department || null},
        can_access_uptodate = ${data.can_access_uptodate || false},
        industry = ${data.industry || null},
        portfolio_value = ${data.portfolio_value || null},
        risk_profile = ${data.risk_profile || null},
        account_manager_id = ${data.account_manager_id || null},
        is_active = ${data.is_active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating account:", error)
    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ message: "Account ID or email already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Error updating account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM accounts WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ message: "Error deleting account" }, { status: 500 })
  }
}
