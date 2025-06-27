"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Users, Shield, UserCheck, User } from "lucide-react"

interface Account {
  id: string
  username: string
  name: string
  email: string
  account_type: "admin" | "manager" | "employee" | "client"
  role?: string
  department?: string
  created_at: string
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    account_type: "employee" as const,
    role: "",
    department: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")
      const data = await response.json()
      setAccounts(data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (account: typeof newAccount) => {
    const errors: Record<string, string> = {}

    if (!account.username.trim()) {
      errors.username = "Username is required"
    }

    if (!account.password.trim()) {
      errors.password = "Password is required"
    } else if (account.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!account.name.trim()) {
      errors.name = "Name is required"
    }

    if (!account.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!account.account_type) {
      errors.account_type = "Account type is required"
    }

    return errors
  }

  const handleAddAccount = async () => {
    const errors = validateForm(newAccount)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create account")
      }

      await fetchAccounts()
      setIsAddDialogOpen(false)
      setNewAccount({
        username: "",
        password: "",
        name: "",
        email: "",
        account_type: "employee",
        role: "",
        department: "",
      })
      setValidationErrors({})
    } catch (error) {
      console.error("Error creating account:", error)
      setValidationErrors({ general: error instanceof Error ? error.message : "Failed to create account" })
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setIsEditDialogOpen(true)
  }

  const handleUpdateAccount = async () => {
    if (!editingAccount) return

    try {
      const response = await fetch(`/api/accounts/${editingAccount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingAccount.name,
          email: editingAccount.email,
          account_type: editingAccount.account_type,
          role: editingAccount.role,
          department: editingAccount.department,
        }),
      })

      if (!response.ok) throw new Error("Failed to update account")

      await fetchAccounts()
      setIsEditDialogOpen(false)
      setEditingAccount(null)
    } catch (error) {
      console.error("Error updating account:", error)
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete account")

      await fetchAccounts()
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />
      case "manager":
        return <UserCheck className="h-4 w-4 text-purple-600" />
      case "employee":
        return <User className="h-4 w-4 text-blue-600" />
      case "client":
        return <Users className="h-4 w-4 text-green-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>
      case "manager":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Manager</Badge>
      case "employee":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Employee</Badge>
      case "client":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Client</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Account Management
          </h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new user account with specified permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {validationErrors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{validationErrors.general}</div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <div className="col-span-3">
                  <Input
                    id="username"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                    className={validationErrors.username ? "border-red-500" : ""}
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    type="password"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                    className={validationErrors.password ? "border-red-500" : ""}
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="account_type" className="text-right">
                  Account Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={newAccount.account_type}
                    onValueChange={(value: "admin" | "manager" | "employee" | "client") =>
                      setNewAccount({ ...newAccount, account_type: value })
                    }
                  >
                    <SelectTrigger className={validationErrors.account_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.account_type && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.account_type}</p>
                  )}
                </div>
              </div>

              {(newAccount.account_type === "admin" ||
                newAccount.account_type === "manager" ||
                newAccount.account_type === "employee") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={newAccount.role}
                      onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Senior Analyst, Team Lead"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={newAccount.department}
                      onChange={(e) => setNewAccount({ ...newAccount, department: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Finance, Operations"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddAccount}>
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts ({accounts.length})</CardTitle>
          <CardDescription>Manage all user accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getAccountTypeIcon(account.account_type)}
                      {account.username}
                    </div>
                  </TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{getAccountTypeBadge(account.account_type)}</TableCell>
                  <TableCell>{account.role || "-"}</TableCell>
                  <TableCell>{account.department || "-"}</TableCell>
                  <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditAccount(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update account information and permissions.</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-account-type" className="text-right">
                  Account Type
                </Label>
                <Select
                  value={editingAccount.account_type}
                  onValueChange={(value: "admin" | "manager" | "employee" | "client") =>
                    setEditingAccount({ ...editingAccount, account_type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(editingAccount.account_type === "admin" ||
                editingAccount.account_type === "manager" ||
                editingAccount.account_type === "employee") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Role
                    </Label>
                    <Input
                      id="edit-role"
                      value={editingAccount.role || ""}
                      onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="edit-department"
                      value={editingAccount.department || ""}
                      onChange={(e) => setEditingAccount({ ...editingAccount, department: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateAccount}>
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
