"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, Plus, Trash2, Users, Shield, UserCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Account {
  id: number
  account_id: string
  username: string
  password: string
  role: "admin" | "employee" | "client"
  name: string
  email: string
  mobile_number: string
  address: string
  created_at: string
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Account | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    account_id: "",
    username: "",
    password: "",
    role: "employee",
    name: "",
    email: "",
    mobile_number: "",
    address: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      if (!response.ok) {
        throw new Error("Failed to fetch accounts")
      }
      const data = await response.json()
      setAccounts(data)
    } catch (error) {
      console.error("Failed to load accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAccountId = () => {
    return `ACC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }

  function handleEdit(account: Account) {
    setEditingId(account.id)
    setEditData({ ...account })
  }

  function handleCancel() {
    setEditingId(null)
    setEditData(null)
  }

  async function handleSave() {
    if (!editData) return

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!editData.account_id?.trim()) {
      errors.account_id = "Account ID is required"
      alert("Account ID is required")
      return
    }

    if (!editData.username?.trim()) {
      errors.username = "Username is required"
      alert("Username is required")
      return
    }

    if (!editData.password?.trim()) {
      errors.password = "Password is required"
      alert("Password is required")
      return
    }

    if (!editData.name?.trim()) {
      errors.name = "Name is required"
      alert("Name is required")
      return
    }

    if (!editData.email?.trim()) {
      errors.email = "Email is required"
      alert("Email is required")
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errors.email = "Please enter a valid email address"
      alert("Please enter a valid email address")
      return
    }

    if (!editData.mobile_number?.trim()) {
      errors.mobile_number = "Mobile number is required"
      alert("Mobile number is required")
      return
    }

    if (!editData.address?.trim()) {
      errors.address = "Address is required"
      alert("Address is required")
      return
    }

    // Check for duplicate username (excluding current account)
    if (editData.username?.trim()) {
      const existingAccount = accounts.find(
        (account) => account.username.toLowerCase() === editData.username?.toLowerCase() && account.id !== editData.id,
      )
      if (existingAccount) {
        alert("An account with this username already exists")
        return
      }
    }

    // Check for duplicate email (excluding current account)
    if (editData.email?.trim()) {
      const existingAccount = accounts.find(
        (account) => account.email.toLowerCase() === editData.email?.toLowerCase() && account.id !== editData.id,
      )
      if (existingAccount) {
        alert("An account with this email already exists")
        return
      }
    }

    try {
      const response = await fetch(`/api/accounts/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: editData.account_id.trim(),
          username: editData.username.trim(),
          password: editData.password.trim(),
          role: editData.role,
          name: editData.name.trim(),
          email: editData.email.trim(),
          mobile_number: editData.mobile_number.trim(),
          address: editData.address.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update account")
      }

      const updated = await response.json()
      setAccounts(accounts.map((account) => (account.id === updated.id ? updated : account)))
      setEditingId(null)
      setEditData(null)
    } catch (error) {
      console.error("Failed to update account:", error)
      alert("Failed to update account. Please try again.")
    }
  }

  function handleChange(field: keyof Account, value: string) {
    if (!editData) return
    setEditData({ ...editData, [field]: value })
  }

  function handleNewAccountChange(field: keyof Account, value: string) {
    setNewAccount({ ...newAccount, [field]: value })
  }

  async function handleAddAccount() {
    // Reset validation errors
    setValidationErrors({})

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!newAccount.username?.trim()) {
      errors.username = "Username is required"
    }

    if (!newAccount.password?.trim()) {
      errors.password = "Password is required"
    }

    if (!newAccount.name?.trim()) {
      errors.name = "Name is required"
    }

    if (!newAccount.email?.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAccount.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!newAccount.mobile_number?.trim()) {
      errors.mobile_number = "Mobile number is required"
    }

    if (!newAccount.address?.trim()) {
      errors.address = "Address is required"
    }

    // Check for duplicate username
    if (newAccount.username?.trim()) {
      const existingAccount = accounts.find(
        (account) => account.username.toLowerCase() === newAccount.username?.toLowerCase(),
      )
      if (existingAccount) {
        errors.username = "An account with this username already exists"
      }
    }

    // Check for duplicate email
    if (newAccount.email?.trim()) {
      const existingAccount = accounts.find(
        (account) => account.email.toLowerCase() === newAccount.email?.toLowerCase(),
      )
      if (existingAccount) {
        errors.email = "An account with this email already exists"
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const accountId = generateAccountId()

      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: accountId,
          username: newAccount.username?.trim() || "",
          password: newAccount.password?.trim() || "",
          role: newAccount.role || "employee",
          name: newAccount.name?.trim() || "",
          email: newAccount.email?.trim() || "",
          mobile_number: newAccount.mobile_number?.trim() || "",
          address: newAccount.address?.trim() || "",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add account")
      }

      const account = await response.json()
      setAccounts([...accounts, account])
      setNewAccount({
        account_id: "",
        username: "",
        password: "",
        role: "employee",
        name: "",
        email: "",
        mobile_number: "",
        address: "",
      })
      setValidationErrors({})
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add account:", error)
      setValidationErrors({ general: "Failed to add account. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDeleteClick(account: Account) {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!accountToDelete) return

    try {
      const response = await fetch(`/api/accounts/${accountToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      setAccounts(accounts.filter((account) => account.id !== accountToDelete.id))
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
    } catch (error) {
      console.error("Failed to delete account:", error)
      alert("Failed to delete account. Please try again.")
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false)
    setAccountToDelete(null)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      case "employee":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Employee
          </Badge>
        )
      case "client":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Users className="h-3 w-3 mr-1" />
            Client
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{role}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          Account Management
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" /> Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new user account with specified role and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {validationErrors.general && (
                <div className="col-span-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {validationErrors.general}
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="username"
                    value={newAccount.username || ""}
                    onChange={(e) => handleNewAccountChange("username", e.target.value)}
                    placeholder="Enter username"
                    className={validationErrors.username ? "border-red-500" : ""}
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    type="password"
                    value={newAccount.password || ""}
                    onChange={(e) => handleNewAccountChange("password", e.target.value)}
                    placeholder="Enter password"
                    className={validationErrors.password ? "border-red-500" : ""}
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  id="role"
                  value={newAccount.role || "employee"}
                  onChange={(e) => handleNewAccountChange("role", e.target.value as any)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newAccount.name || ""}
                    onChange={(e) => handleNewAccountChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={newAccount.email || ""}
                    onChange={(e) => handleNewAccountChange("email", e.target.value)}
                    placeholder="user@example.com"
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile_number" className="text-right">
                  Mobile <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="mobile_number"
                    value={newAccount.mobile_number || ""}
                    onChange={(e) => handleNewAccountChange("mobile_number", e.target.value)}
                    placeholder="+1-555-0123"
                    className={validationErrors.mobile_number ? "border-red-500" : ""}
                  />
                  {validationErrors.mobile_number && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.mobile_number}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="address"
                    value={newAccount.address || ""}
                    onChange={(e) => handleNewAccountChange("address", e.target.value)}
                    placeholder="Enter address"
                    className={validationErrors.address ? "border-red-500" : ""}
                  />
                  {validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddAccount}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border overflow-hidden backdrop-blur-sm bg-white/90">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Account ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {editingId === account.id ? (
                      <Input
                        value={editData?.account_id || ""}
                        onChange={(e) => handleChange("account_id", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      account.account_id
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === account.id ? (
                      <Input
                        value={editData?.username || ""}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      account.username
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === account.id ? (
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      account.name
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {editingId === account.id ? (
                      <Input
                        value={editData?.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      account.email
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {editingId === account.id ? (
                      <Input
                        value={editData?.mobile_number || ""}
                        onChange={(e) => handleChange("mobile_number", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      account.mobile_number
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === account.id ? (
                      <select
                        value={editData?.role || "employee"}
                        onChange={(e) => handleChange("role", e.target.value as any)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="client">Client</option>
                      </select>
                    ) : (
                      getRoleBadge(account.role)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === account.id ? (
                      <div className="flex justify-end space-x-1">
                        <Button size="icon" variant="outline" onClick={handleSave} className="h-8 w-8 bg-transparent">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleCancel} className="h-8 w-8 bg-transparent">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-1">
                        <Button size="icon" variant="outline" onClick={() => handleEdit(account)} className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDeleteClick(account)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No accounts available. Add your first account above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {accountToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Account ID:</span> {accountToDelete.account_id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Username:</span> {accountToDelete.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Name:</span> {accountToDelete.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Role:</span> {accountToDelete.role}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
