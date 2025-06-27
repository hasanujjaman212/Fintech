"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Search, Filter, Download, Eye } from "lucide-react"

interface CompletedClient {
  id: number
  client_name: string
  client_email: string
  client_mobile: string
  employee_id: string
  employee_name: string
  completion_date: string
  notes?: string
  status: string
}

export default function CompletedClients() {
  const [completedClients, setCompletedClients] = useState<CompletedClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEmployee, setFilterEmployee] = useState("all")
  const [employees, setEmployees] = useState<string[]>([])

  useEffect(() => {
    fetchCompletedClients()
  }, [])

  const fetchCompletedClients = async () => {
    try {
      const response = await fetch("/api/completed-clients")
      if (response.ok) {
        const data = await response.json()
        setCompletedClients(data)

        // Extract unique employee names for filter
        const uniqueEmployees = [...new Set(data.map((client: CompletedClient) => client.employee_name))]
        setEmployees(uniqueEmployees)
      }
    } catch (error) {
      console.error("Error fetching completed clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = completedClients.filter((client) => {
    const matchesSearch =
      client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.employee_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEmployee = filterEmployee === "all" || client.employee_name === filterEmployee

    return matchesSearch && matchesEmployee
  })

  const exportToCSV = () => {
    const headers = ["Client Name", "Email", "Mobile", "Employee", "Completion Date", "Notes"]
    const csvContent = [
      headers.join(","),
      ...filteredClients.map((client) =>
        [
          client.client_name,
          client.client_email,
          client.client_mobile,
          client.employee_name,
          new Date(client.completion_date).toLocaleDateString(),
          client.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "completed-clients.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading completed clients...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Completed Clients
          </h2>
          <p className="text-muted-foreground">View all completed client interactions across the organization</p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedClients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {
                completedClients.filter((client) => {
                  const completionDate = new Date(client.completion_date)
                  const now = new Date()
                  return (
                    completionDate.getMonth() === now.getMonth() && completionDate.getFullYear() === now.getFullYear()
                  )
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterEmployee} onValueChange={setFilterEmployee}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee} value={employee}>
                {employee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Completed Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Client Interactions ({filteredClients.length})</CardTitle>
          <CardDescription>All completed client interactions from across the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Handled By</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.client_name}</TableCell>
                      <TableCell>{client.client_email}</TableCell>
                      <TableCell>{client.client_mobile}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {client.employee_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          {client.employee_name}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(client.completion_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate" title={client.notes}>
                          {client.notes || "No notes"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm || filterEmployee !== "all"
                        ? "No completed clients match your filters"
                        : "No completed clients yet"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
