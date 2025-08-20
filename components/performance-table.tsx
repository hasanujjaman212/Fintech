"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, Plus, Trash2, MessageSquare, ImageIcon } from "lucide-react"
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
import { TrendingUp } from "lucide-react"

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
  image_url?: string
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
  const [selectedEntry, setSelectedEntry] = useState<PerformanceEntry | null>(null)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<PerformanceEntry | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

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

  const handleImageUpload = async (file: File, entryId?: number) => {
    if (!file) return null

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)")
      return null
    }

    if (file.size > maxSize) {
      alert("File size must be less than 5MB")
      return null
    }

    setUploadingImage(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("employeeId", employeeId)
      if (entryId) formData.append("entryId", entryId.toString())

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
      return null
    } finally {
      setUploadingImage(false)
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

    // Validation logic here...
    const errors: Record<string, string> = {}

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

    if (!editData.purpose?.trim()) {
      errors.purpose = "Purpose is required"
      alert("Purpose is required")
      return
    }

    // Check for duplicate email (excluding current entry)
    if (editData.email?.trim()) {
      const existingEntry = entries.find(
        (entry) => entry.email.toLowerCase() === editData.email?.toLowerCase() && entry.id !== editData.id,
      )
      if (existingEntry) {
        alert("A client with this email already exists")
        return
      }
    }

    try {
      const response = await fetch(`/api/performance/${employeeId}/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name.trim(),
          email: editData.email.trim(),
          mobile_number: editData.mobile_number.trim(),
          address: editData.address.trim(),
          purpose: editData.purpose.trim(),
          employee_id: editData.employee_id,
          status: editData.status,
          notes: editData.notes?.trim() || "",
          image_url: editData.image_url || null,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `Failed to update entry. Server responded with status: ${response.status}`
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        }
        throw new Error(errorMessage)
      }

      const updated = await response.json()

      // If status changed to completed, handle the transfer
      if (editData.status === "completed" && entries.find((e) => e.id === editData.id)?.status !== "completed") {
        await handleCompletedTransfer(updated)
        // Remove from current list
        setEntries(entries.filter((entry) => entry.id !== updated.id))
      } else {
        setEntries(entries.map((entry) => (entry.id === updated.id ? updated : entry)))
      }

      setEditingId(null)
      setEditData(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      alert(`Failed to update entry: ${errorMessage}`)
      console.error("Failed to update entry:", error)
    }
  }

  async function handleCompletedTransfer(entry: PerformanceEntry) {
    try {
      // Get employee name
      const employeeData = localStorage.getItem("employeeData")
      const employeeName = employeeData ? JSON.parse(employeeData).name : "Unknown Employee"

      const response = await fetch("/api/completed-clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_entry_id: entry.id,
          serial_number: entry.serial_number,
          name: entry.name,
          email: entry.email,
          mobile_number: entry.mobile_number,
          address: entry.address,
          purpose: entry.purpose,
          employee_id: entry.employee_id,
          employee_name: employeeName,
          date: entry.date,
          notes: entry.notes || "",
          image_url: entry.image_url || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to transfer completed client")
      }
    } catch (error) {
      console.error("Failed to transfer completed client:", error)
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
    // Reset validation errors
    setValidationErrors({})

    // Validate required fields
    const errors: Record<string, string> = {}

    if (!newEntry.name?.trim()) {
      errors.name = "Name is required"
    }

    if (!newEntry.email?.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEntry.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!newEntry.mobile_number?.trim()) {
      errors.mobile_number = "Mobile number is required"
    }

    if (!newEntry.address?.trim()) {
      errors.address = "Address is required"
    }

    if (!newEntry.purpose?.trim()) {
      errors.purpose = "Purpose is required"
    }

    // Check for duplicate email
    if (newEntry.email?.trim()) {
      const existingEntry = entries.find((entry) => entry.email.toLowerCase() === newEntry.email?.toLowerCase())
      if (existingEntry) {
        errors.email = "A client with this email already exists"
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const newSerialNumber = entries.length > 0 ? Math.max(...entries.map((e) => e.serial_number)) + 1 : 1

      const response = await fetch(`/api/performance/${employeeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: newSerialNumber,
          name: newEntry.name?.trim() || "",
          email: newEntry.email?.trim() || "",
          mobile_number: newEntry.mobile_number?.trim() || "",
          address: newEntry.address?.trim() || "",
          purpose: newEntry.purpose?.trim() || "",
          employee_id: employeeId,
          date: new Date().toISOString().split("T")[0],
          status: newEntry.status || "pending",
          notes: newEntry.notes?.trim() || "",
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `Failed to add client. Server responded with status: ${response.status}`
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        }
        throw new Error(errorMessage)
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
      setValidationErrors({})
      setIsAddDialogOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      setValidationErrors({ general: errorMessage })
      console.error("Failed to add entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDeleteClick(entry: PerformanceEntry) {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!entryToDelete) return

    try {
      const response = await fetch(`/api/performance/${employeeId}/${entryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete entry")
      }

      setEntries(entries.filter((entry) => entry.id !== entryToDelete.id))
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    } catch (error) {
      console.error("Failed to delete entry:", error)
      alert("Failed to delete entry. Please try again.")
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  async function getAiSuggestion(entry: PerformanceEntry) {
    setSelectedEntry(entry)
    setAiLoading(true)
    setShowAiDialog(true)
    setAiSuggestion(null)

    try {
      const prompt = `
        You are an assistant for a financial services company.
        
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
        throw new Error("Failed to generate suggestion")
      }

      const data = await response.json()
      setAiSuggestion(data.text)
    } catch (error) {
      console.error("Error generating suggestion:", error)
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
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Client Interactions
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-white hover:opacity-90 skeumorphic-button">
              <Plus className="h-4 w-4 mr-2" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg glass-card">
            <DialogHeader>
              <DialogTitle>Add New Client Interaction</DialogTitle>
              <DialogDescription>Enter the details of the new client interaction.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {validationErrors.general && (
                <div className="col-span-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {validationErrors.general}
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newEntry.name || ""}
                    onChange={(e) => handleNewEntryChange("name", e.target.value)}
                    placeholder="Client full name"
                    className={`skeumorphic-input ${validationErrors.name ? "border-red-500" : ""}`}
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
                    value={newEntry.email || ""}
                    onChange={(e) => handleNewEntryChange("email", e.target.value)}
                    placeholder="client@example.com"
                    className={`skeumorphic-input ${validationErrors.email ? "border-red-500" : ""}`}
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
                    value={newEntry.mobile_number || ""}
                    onChange={(e) => handleNewEntryChange("mobile_number", e.target.value)}
                    placeholder="+1-555-0123"
                    className={`skeumorphic-input ${validationErrors.mobile_number ? "border-red-500" : ""}`}
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
                    value={newEntry.address || ""}
                    onChange={(e) => handleNewEntryChange("address", e.target.value)}
                    placeholder="Client address"
                    className={`skeumorphic-input ${validationErrors.address ? "border-red-500" : ""}`}
                  />
                  {validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                  Purpose <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="purpose"
                    value={newEntry.purpose || ""}
                    onChange={(e) => handleNewEntryChange("purpose", e.target.value)}
                    placeholder="Loan application, Investment consultation, etc."
                    className={`skeumorphic-input ${validationErrors.purpose ? "border-red-500" : ""}`}
                  />
                  {validationErrors.purpose && <p className="text-red-500 text-xs mt-1">{validationErrors.purpose}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status <span className="text-red-500">*</span>
                </Label>
                <select
                  id="status"
                  value={newEntry.status || "pending"}
                  onChange={(e) => handleNewEntryChange("status", e.target.value as any)}
                  className="col-span-3 skeumorphic-input"
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
                  className="col-span-3 skeumorphic-input"
                  placeholder="Additional notes (optional)..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
                className="skeumorphic-button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddEntry}
                disabled={isSubmitting}
                className="gradient-bg text-white hover:opacity-90"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Client"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border overflow-hidden liquid-glass">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/20">
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
                <TableRow key={entry.id} className="hover:bg-white/10">
                  <TableCell className="font-medium">{entry.serial_number}</TableCell>
                  <TableCell>
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-9 skeumorphic-input"
                      />
                    ) : (
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        {entry.image_url && (
                          <div className="flex items-center gap-1 mt-1">
                            <ImageIcon className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600">Has attachment</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="h-9 skeumorphic-input"
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
                        className="h-9 skeumorphic-input"
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
                        className="h-9 skeumorphic-input"
                      />
                    ) : (
                      <div className="max-w-32 truncate" title={entry.address}>
                        {entry.address}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === entry.id ? (
                      <Input
                        value={editData?.purpose || ""}
                        onChange={(e) => handleChange("purpose", e.target.value)}
                        className="h-9 skeumorphic-input"
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
                        className="h-9 w-full rounded-md skeumorphic-input"
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
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleSave}
                          className="h-8 w-8 skeumorphic-button bg-transparent"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleCancel}
                          className="h-8 w-8 skeumorphic-button bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => getAiSuggestion(entry)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 skeumorphic-button"
                          title="Get recommendations"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(entry)}
                          className="h-8 w-8 skeumorphic-button"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDeleteClick(entry)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 skeumorphic-button"
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

      {/* Chat Assistant Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Chat Assistant Recommendations
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
                  <p className="text-sm text-gray-600">Generating recommendations...</p>
                </div>
              </div>
            ) : aiSuggestion ? (
              <div className="morphism-card p-4 rounded-lg">
                <div className="text-sm text-blue-700 whitespace-pre-wrap">{aiSuggestion}</div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No recommendations available</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAiDialog(false)} className="gradient-bg text-white hover:opacity-90">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client interaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {entryToDelete && (
            <div className="py-4">
              <div className="morphism-card p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Client:</span> {entryToDelete.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span> {entryToDelete.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Purpose:</span> {entryToDelete.purpose}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Status:</span> {entryToDelete.status}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelDelete} className="skeumorphic-button bg-transparent">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
