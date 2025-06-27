import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const accountId = Number.parseInt(params.id)

    if (isNaN(accountId)) {
      return NextResponse.json({ error: "Invalid account ID" }, { status: 400 })
    }

    // Validate required fields
    if (
      !data.account_id ||
      !data.username ||
      !data.password ||
      !data.name ||
      !data.email ||
      !data.mobile_number ||
      !data.address
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check for duplicate username (excluding current account)
    const existingUsername = await sql`
      SELECT id FROM accounts WHERE username = ${data.username} AND id != ${accountId}
    `

    if (existingUsername.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Check for duplicate email (excluding current account)
    const existingEmail = await sql`
      SELECT id FROM accounts WHERE email = ${data.email} AND id != ${accountId}
    `

    if (existingEmail.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const result = await sql`
      UPDATE accounts 
      SET 
        account_id = ${data.account_id},
        username = ${data.username}, 
        password = ${data.password}, 
        role = ${data.role}, 
        name = ${data.name}, 
        email = ${data.email}, 
        mobile_number = ${data.mobile_number}, 
        address = ${data.address}
      WHERE id = ${accountId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const accountId = Number.parseInt(params.id)

    if (isNaN(accountId)) {
      return NextResponse.json({ error: "Invalid account ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM accounts WHERE id = ${accountId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
