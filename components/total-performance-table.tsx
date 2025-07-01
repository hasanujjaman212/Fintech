"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PerformanceEntry {
  id: string
  serialNumber: number
  employeeName: string
  employeeId: string
  clientName: string
  purpose: string
  date: string
  status: "pending" | "completed" | "in-progress"
  efficiency: number
}

// Mock data for total performance across all employees
const mockTotalPerformance: PerformanceEntry[] = [
  {
    id: "tp7",
    serialNumber: 7,
    employeeName: "",
    employeeId: "",
    clientName: "",
    purpose: "",
    date: "",
    status: "",
    efficiency: 80,
  },
]

export default function TotalPerformanceTable() {
  const [entries, setEntries] = useState<PerformanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [aiInsights, setAiInsights] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = () => {
      setTimeout(() => {
        setEntries(mockTotalPerformance)
        setLoading(false)
        // Simulate AI insights
        setAiInsights(
          "AI Analysis: Team performance is 88% efficient on average. John Smith shows the highest efficiency at 96%. Loan applications have the longest processing time.",
        )
      }, 1000)
    }

    loadData()
  }, [])

  const filteredEntries = entries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 80) return "text-blue-600"
    if (efficiency >= 70) return "text-amber-600"
    return "text-red-600"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          AI-Enhanced Team Performance
        </h3>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {aiInsights && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p>{aiInsights}</p>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px]">S.No</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Purpose</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{entry.serialNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{entry.employeeName}</p>
                      <p className="text-xs text-gray-500">{entry.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{entry.clientName}</TableCell>
                  <TableCell className="hidden md:table-cell">{entry.purpose}</TableCell>
                  <TableCell className="hidden lg:table-cell">{entry.date}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${getEfficiencyColor(entry.efficiency)}`}>{entry.efficiency}%</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No performance data found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
