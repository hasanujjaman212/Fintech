"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Account {
  id: number
  account_id: string
  name: string
  email: string
  mobile_number: string
  password: string
  account_type: "admin" | "manager" | "employee" | "client"
  role?: string
  department?: string
  can_access_uptodate?: boolean
  industry?: string
  portfolio_value?: number
  risk_profile?: string
  account_manager_id?: string
  is_active: boolean
  created_at: string
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    account_id: "",
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    account_type: "employee" as "admin" | "manager" | "employee" | "client",
    role: "",
    department: "",
    can_access_uptodate: false,
    industry: "",
    portfolio_value: "",
    risk_profile: "",
    account_manager_id: "",
    is_active: true,
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingAccount ? `/api/accounts/${editingAccount.id}` : "/api/accounts"
      const method = editingAccount ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          portfolio_value: formData.portfolio_value ? Number.parseFloat(formData.portfolio_value) : null,
        }),
      })

      if (response.ok) {
        await fetchAccounts()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.message || "Error saving account")
      }
    } catch (error) {
      console.error("Error saving account:", error)
      alert("Error saving account")
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      account_id: account.account_id,
      name: account.name,
      email: account.email,
      mobile_number: account.mobile_number,
      password: account.password,
      account_type: account.account_type,
      role: account.role || "",
      department: account.department || "",
      can_access_uptodate: account.can_access_uptodate || false,
      industry: account.industry || "",
      portfolio_value: account.portfolio_value?.toString() || "",
      risk_profile: account.risk_profile || "",
      account_manager_id: account.account_manager_id || "",
      is_active: account.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await fetch(`/api/accounts/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchAccounts()
        } else {
          alert("Error deleting account")
        }
      } catch (error) {
        console.error("Error deleting account:", error)
        alert("Error deleting account")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      account_id: "",
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      account_type: "employee",
      role: "",
      department: "",
      can_access_uptodate: false,
      industry: "",
      portfolio_value: "",
      risk_profile: "",
      account_manager_id: "",
      is_active: true,
    })
    setEditingAccount(null)
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-purple-100 text-purple-800"
      case "employee":
        return "bg-blue-100 text-blue-800"
      case "client":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading accounts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Account Management</h2>
          <p className="text-muted-foreground">Manage all user accounts in the system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Account" : "Create New Account"}</DialogTitle>
              <DialogDescription>
                {editingAccount ? "Update account information" : "Add a new user account to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account_id">Account ID *</Label>
                  <Input
                    id="account_id"
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_type">Account Type *</Label>
                  <Select
                    value={formData.account_type}
                    onValueChange={(value: "admin" | "manager" | "employee" | "client") =>
                      setFormData({ ...formData, account_type: value })
                    }
                  >
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobile_number">Mobile Number *</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {(formData.account_type === "admin" ||
                formData.account_type === "manager" ||
                formData.account_type === "employee") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="can_access_uptodate"
                      checked={formData.can_access_uptodate}
                      onCheckedChange={(checked) => setFormData({ ...formData, can_access_uptodate: checked })}
                    />
                    <Label htmlFor="can_access_uptodate">Can Access Up-to-date Features</Label>
                  </div>
                </>
              )}

              {formData.account_type === "client" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio_value">Portfolio Value</Label>
                      <Input
                        id="portfolio_value"
                        type="number"
                        step="0.01"
                        value={formData.portfolio_value}
                        onChange={(e) => setFormData({ ...formData, portfolio_value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="risk_profile">Risk Profile</Label>
                      <Select
                        value={formData.risk_profile}
                        onValueChange={(value) => setFormData({ ...formData, risk_profile: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk profile" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conservative">Conservative</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="account_manager_id">Account Manager ID</Label>
                      <Input
                        id="account_manager_id"
                        value={formData.account_manager_id}
                        onChange={(e) => setFormData({ ...formData, account_manager_id: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active Account</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingAccount ? "Update Account" : "Create Account"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts ({accounts.length})</CardTitle>
          <CardDescription>Manage user accounts across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Role/Industry</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.account_id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <Badge className={getAccountTypeColor(account.account_type)}>{account.account_type}</Badge>
                    </TableCell>
                    <TableCell>{account.account_type === "client" ? account.industry : account.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {showPasswords[account.account_id] ? account.password : "••••••••"}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(account.account_id)}>
                          {showPasswords[account.account_id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.is_active ? "default" : "secondary"}>
                        {account.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(account.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
