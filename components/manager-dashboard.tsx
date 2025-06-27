"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Search, Eye, Download, Users, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PendingInProgressEntry {
  id: string
  serial_number: number
  name: string
  email: string
  mobile_number: string
  address: string
  purpose: string
  employee_id: string
  employee_name: string
  date: string
  status: "pending" | "in-progress"
  notes?: string
  image_url?: string
}

export default function ManagerDashboard() {
  const [entries, setEntries] = useState<PendingInProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [employeeFilter, setEmployeeFilter] = useState("all")
  const [selectedEntry, setSelectedEntry] = useState<PendingInProgressEntry | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [employees, setEmployees] = useState<string[]>([])

  useEffect(() => {
    fetchPendingInProgressEntries()
  }, [])

  const fetchPendingInProgressEntries = async () => {
    try {
      const response = await fetch("/api/performance/pending-inprogress")
      if (!response.ok) {
        throw new Error("Failed to fetch pending/in-progress entries")
      }
      const data = await response.json()
      setEntries(data)

      // Extract unique employee names for filter
      const uniqueEmployees = [...new Set(data.map((entry: PendingInProgressEntry) => entry.employee_name))]
      setEmployees(uniqueEmployees)
    } catch (error) {
      console.error("Failed to load pending/in-progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employee_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    const matchesEmployee = employeeFilter === "all" || entry.employee_name === employeeFilter

    return matchesSearch && matchesStatus && matchesEmployee
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
    }
  }

  const exportToCSV = () => {
    if (filteredEntries.length === 0) {
      alert("No data to export")
      return
    }

    const headers = [
      "S.No",
      "Client Name",
      "Email",
      "Mobile",
      "Address",
      "Purpose",
      "Employee",
      "Date",
      "Status",
      "Notes",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredEntries.map((entry) =>
        [
          entry.serial_number,
          entry.name,
          entry.email,
          entry.mobile_number,
          entry.address,
          entry.purpose,
          entry.employee_name,
          entry.date,
          entry.status,
          entry.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pending-inprogress-clients.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewDetails = (entry: PendingInProgressEntry) => {
    setSelectedEntry(entry)
    setShowDetailsDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Manager Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor all pending and in-progress client interactions</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" disabled={filteredEntries.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {entries.filter((e) => e.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {entries.filter((e) => e.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{employees.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients, employees, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
          <SelectTrigger className="w-full md:w-48">
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

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Active Client Interactions ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[60px]">S.No</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Mobile</TableHead>
                  <TableHead className="hidden xl:table-cell">Address</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{entry.serial_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{entry.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{entry.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{entry.mobile_number}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="max-w-32 truncate" title={entry.address}>
                          {entry.address}
                        </div>
                      </TableCell>
                      <TableCell>{entry.purpose}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{entry.employee_name}</p>
                          <p className="text-xs text-gray-500">{entry.employee_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(entry)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      {searchTerm || statusFilter !== "all" || employeeFilter !== "all"
                        ? "No client interactions found matching your filters."
                        : "No pending or in-progress client interactions found."}
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
            <DialogTitle>Client Interaction Details</DialogTitle>
            <DialogDescription>Complete information for this client interaction</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Name</label>
                  <p className="text-sm text-gray-900">{selectedEntry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedEntry.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="text-sm text-gray-900">{selectedEntry.mobile_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedEntry.status)}</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-sm text-gray-900">{selectedEntry.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Purpose</label>
                <p className="text-sm text-gray-900">{selectedEntry.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Handled By</label>
                  <p className="text-sm text-gray-900">
                    {selectedEntry.employee_name} ({selectedEntry.employee_id})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedEntry.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{selectedEntry.notes}</p>
                </div>
              )}
              {selectedEntry.image_url && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Attached Image</label>
                  <div className="mt-2">
                    <img
                      src={selectedEntry.image_url || "/placeholder.svg"}
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
