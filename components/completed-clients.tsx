"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Search, Filter, Download, Eye, AlertCircle, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CompletedClient {
  id: number
  original_entry_id?: number
  serial_number?: number
  name?: string
  email?: string
  mobile_number?: string
  address?: string
  purpose?: string
  employee_id?: string
  employee_name?: string
  date?: string
  completion_date?: string
  notes?: string
  status?: string
  image_url?: string
  // Alternative field names that might come from API
  client_name?: string
  client_email?: string
  client_mobile?: string
}

export default function CompletedClients() {
  const [completedClients, setCompletedClients] = useState<CompletedClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEmployee, setFilterEmployee] = useState("all")
  const [employees, setEmployees] = useState<string[]>([])
  const [selectedClient, setSelectedClient] = useState<CompletedClient | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    fetchCompletedClients()
  }, [])

  const fetchCompletedClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/completed-clients")

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Handle both error responses and successful responses
      if (data.error) {
        throw new Error(data.error)
      }

      // Ensure data is an array
      const clientsArray = Array.isArray(data) ? data : []
      setCompletedClients(clientsArray)

      // Extract unique employee names for filter (with null checks)
      const uniqueEmployees = [
        ...new Set(
          clientsArray
            .map((client: CompletedClient) => client.employee_name || client.employee_id)
            .filter((name): name is string => Boolean(name)),
        ),
      ]
      setEmployees(uniqueEmployees)
    } catch (error) {
      console.error("Error fetching completed clients:", error)
      setError(error instanceof Error ? error.message : "Failed to load completed clients")
      setCompletedClients([])
    } finally {
      setLoading(false)
    }
  }

  // Safe string comparison helper
  const safeIncludes = (str: string | undefined | null, searchTerm: string): boolean => {
    return str ? str.toLowerCase().includes(searchTerm.toLowerCase()) : false
  }

  const filteredClients = completedClients.filter((client) => {
    // Get client name from either field
    const clientName = client.name || client.client_name || ""
    const clientEmail = client.email || client.client_email || ""
    const employeeName = client.employee_name || client.employee_id || ""

    const matchesSearch =
      safeIncludes(clientName, searchTerm) ||
      safeIncludes(clientEmail, searchTerm) ||
      safeIncludes(employeeName, searchTerm)

    const matchesEmployee = filterEmployee === "all" || employeeName === filterEmployee

    return matchesSearch && matchesEmployee
  })

  const exportToCSV = () => {
    if (filteredClients.length === 0) {
      alert("No data to export")
      return
    }

    const headers = ["Client Name", "Email", "Mobile", "Address", "Purpose", "Employee", "Completion Date", "Notes"]
    const csvContent = [
      headers.join(","),
      ...filteredClients.map((client) =>
        [
          client.name || client.client_name || "",
          client.email || client.client_email || "",
          client.mobile_number || client.client_mobile || "",
          client.address || "",
          client.purpose || "",
          client.employee_name || client.employee_id || "",
          client.completion_date ? new Date(client.completion_date).toLocaleDateString() : "",
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

  const handleViewDetails = (client: CompletedClient) => {
    setSelectedClient(client)
    setShowDetailsDialog(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading completed clients...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-700">Error Loading Completed Clients</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <Button onClick={fetchCompletedClients} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
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
        <Button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700"
          disabled={filteredClients.length === 0}
        >
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
                  if (!client.completion_date) return false
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
                  <TableHead className="hidden lg:table-cell">Address</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Handled By</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => {
                    const clientName = client.name || client.client_name || "N/A"
                    const clientEmail = client.email || client.client_email || "N/A"
                    const clientMobile = client.mobile_number || client.client_mobile || "N/A"
                    const employeeName = client.employee_name || client.employee_id || "N/A"

                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {clientName}
                            {client.image_url && <ImageIcon className="h-3 w-3 text-blue-500" title="Has attachment" />}
                          </div>
                        </TableCell>
                        <TableCell>{clientEmail}</TableCell>
                        <TableCell>{clientMobile}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="max-w-32 truncate" title={client.address || ""}>
                            {client.address || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{client.purpose || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {employeeName
                                  .split(" ")
                                  .map((n) => n[0] || "")
                                  .join("")
                                  .toUpperCase() || "?"}
                              </span>
                            </div>
                            {employeeName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.completion_date ? new Date(client.completion_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(client)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Completed Client Details</DialogTitle>
            <DialogDescription>Complete information for this completed client interaction</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Name</label>
                  <p className="text-sm text-gray-900">{selectedClient.name || selectedClient.client_name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">
                    {selectedClient.email || selectedClient.client_email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="text-sm text-gray-900">
                    {selectedClient.mobile_number || selectedClient.client_mobile || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-sm text-gray-900">{selectedClient.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Purpose</label>
                <p className="text-sm text-gray-900">{selectedClient.purpose || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Handled By</label>
                  <p className="text-sm text-gray-900">
                    {selectedClient.employee_name || selectedClient.employee_id || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Completion Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedClient.completion_date
                      ? new Date(selectedClient.completion_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              {selectedClient.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{selectedClient.notes}</p>
                </div>
              )}
              {selectedClient.image_url && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Attached Image</label>
                  <div className="mt-2">
                    <img
                      src={selectedClient.image_url || "/placeholder.svg"}
                      alt="Client interaction attachment"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
