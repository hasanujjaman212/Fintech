"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, Plus, Trash2, Sparkles } from "lucide-react"
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

interface PerformanceEntry {
  id: number
  serial_number: number
  name: string
  email: string
  mobile_number: string
  address: string
  purpose: string
  employee_id: string
  date: string
  status: "pending" | "completed" | "in-progress"
  notes?: string
}

export default function PerformanceTable({ employeeId }: { employeeId: string }) {
  const [entries, setEntries] = useState<PerformanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<PerformanceEntry | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<PerformanceEntry>>({
    name: "",
    email: "",
    mobile_number: "",
    address: "",
    purpose: "",
    status: "pending",
    notes: "",
  })
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<PerformanceEntry | null>(null)
  const [showAiDialog, setShowAiDialog] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [employeeId])

  const fetchEntries = async () => {
    try {
      const response = await fetch(`/api/performance/${employeeId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch entries")
      }
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      console.error("Failed to load performance data:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(entry: PerformanceEntry) {
    setEditingId(entry.id)
    setEditData({ ...entry })
  }

  function handleCancel() {
    setEditingId(null)
    setEditData(null)
  }

  async function handleSave() {
    if (!editData) return

    try {
      const response = await fetch(`/api/performance/${employeeId}/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          mobileNumber: editData.mobile_number,
          address: editData.address,
          purpose: editData.purpose,
          employeeId: editData.employee_id,
          status: editData.status,
          notes: editData.notes || "",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update entry")
      }

      const updated = await response.json()
      setEntries(entries.map((entry) => (entry.id === updated.id ? updated : entry)))
      setEditingId(null)
      setEditData(null)
    } catch (error) {
      console.error("Failed to update entry:", error)
      alert("Failed to update entry. Please try again.")
    }
  }

  function handleChange(field: keyof PerformanceEntry, value: string) {
    if (!editData) return
    setEditData({ ...editData, [field]: value })
  }

  function handleNewEntryChange(field: keyof PerformanceEntry, value: string) {
    setNewEntry({ ...newEntry, [field]: value })
  }

  async function handleAddEntry() {
    try {
      const newSerialNumber = entries.length > 0 ? Math.max(...entries.map((e) => e.serial_number)) + 1 : 1

      const response = await fetch(`/api/performance/${employeeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serialNumber: newSerialNumber,
          name: newEntry.name || "",
          email: newEntry.email || "",
          mobileNumber: newEntry.mobile_number || "",
          address: newEntry.address || "",
          purpose: newEntry.purpose || "",
          employeeId: employeeId,
          date: new Date().toISOString().split("T")[0],
          status: newEntry.status || "pending",
          notes: newEntry.notes || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add entry")
      }

      const entry = await response.json()
      setEntries([...entries, entry])
      setNewEntry({
        name: "",
        email: "",
        mobile_number: "",
        address: "",
        purpose: "",
        status: "pending",
        notes: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }

  async function handleDeleteEntry(id: number) {
    try {
      const response = await fetch(`/api/performance/${employeeId}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete entry")
      }

      setEntries(entries.filter((entry) => entry.id !== id))
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }

  async function getAiSuggestion(entry: PerformanceEntry) {
    setSelectedEntry(entry)
    setAiLoading(true)
    setShowAiDialog(true)
    setAiSuggestion(null)

    try {
      const prompt = `
        You are an AI assistant for a financial services company.
        
        Analyze the following client interaction and provide personalized recommendations for the employee handling this case:
        
        Client Name: ${entry.name}
        Email: ${entry.email}
        Mobile: ${entry.mobile_number}
        Purpose: ${entry.purpose}
        Status: ${entry.status}
        Notes: ${entry.notes || "No notes provided"}
        
        Provide 3-4 specific, actionable recommendations for how the employee should proceed with this client.
        Focus on improving client satisfaction, identifying potential financial opportunities, and ensuring compliance.
        Keep your response concise and professional.
      `

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI suggestion")
      }

      const data = await response.json()
      setAiSuggestion(data.text)
    } catch (error) {
      console.error("Error generating AI suggestion:", error)
      setAiSuggestion("Sorry, I couldn't generate recommendations at this time. Please try again later.")
    } finally {
      setAiLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
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
          <Sparkles className="h-4 w-4 text-blue-600" />
          AI-Enhanced Client Interactions
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Client Interaction</DialogTitle>
              <DialogDescription>Enter the details of the new client interaction.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEntry.name || ""}
                  onChange={(e) => handleNewEntryChange("name", e.target.value)}
                  className="col-span-3"
                  placeholder="Client full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEntry.email || ""}
                  onChange={(e) => handleNewEntryChange("email", e.target.value)}
                  className="col-span-3"
                  placeholder="client@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile_number" className="text-right">
                  Mobile
                </Label>
                <Input
                  id="mobile_number"
                  value={newEntry.mobile_number || ""}
                  onChange={(e) => handleNewEntryChange("mobile_number", e.target.value)}
                  className="col-span-3"
                  placeholder="+1-555-0123"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newEntry.address || ""}
                  onChange={(e) => handleNewEntryChange("address", e.target.value)}
                  className="col-span-3"
                  placeholder="Client address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                  Purpose
                </Label>
                <Input
                  id="purpose"
                  value={newEntry.purpose || ""}
                  onChange={(e) => handleNewEntryChange("purpose", e.target.value)}
                  className="col-span-3"
                  placeholder="Loan application, Investment consultation, etc."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  value={newEntry.status || "pending"}
                  onChange={(e) => handleNewEntryChange("status", e.target.value as any)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={newEntry.notes || ""}
                  onChange={(e) => handleNewEntryChange("notes", e.target.value)}
                  className="col-span-3"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddEntry}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Add Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border overflow-hidden backdrop-blur-sm bg-white/90">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px]">S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Mobile</TableHead>
              <TableHead className="hidden xl:table-cell">Address</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{entry.serial_number}</TableCell>
                  <TableCell>
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      entry.name
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      entry.email
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.mobile_number || ""}
                        onChange={(e) => handleChange("mobile_number", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      entry.mobile_number
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      entry.address
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.purpose || ""}
                        onChange={(e) => handleChange("purpose", e.target.value)}
                        className="h-9"
                      />
                    ) : (
                      entry.purpose
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === entry.id ? (
                      <select
                        value={editData?.status || "pending"}
                        onChange={(e) => handleChange("status", e.target.value as any)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      getStatusBadge(entry.status)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === entry.id ? (
                      <div className="flex justify-end space-x-1">
                        <Button size="icon" variant="outline" onClick={handleSave} className="h-8 w-8">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleCancel} className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => getAiSuggestion(entry)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700"
                          title="Get AI recommendations"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => handleEdit(entry)} className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDeleteEntry(entry.id)}
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
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No client interactions available. Add your first client interaction above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI Recommendations
            </DialogTitle>
            <DialogDescription>
              {selectedEntry && `Smart suggestions for client: ${selectedEntry.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {aiLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-sm text-gray-600">Generating AI recommendations...</p>
                </div>
              </div>
            ) : aiSuggestion ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 whitespace-pre-wrap">{aiSuggestion}</div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No recommendations available</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowAiDialog(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
