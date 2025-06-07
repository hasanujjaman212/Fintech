// Mock data for employee performance
export interface PerformanceEntry {
  id: string
  serialNumber: number
  name: string
  email: string
  address: string
  purpose: string
  employeeId: string
  date: string
  status: "pending" | "completed" | "in-progress"
  notes?: string
}

// Mock data for financial insights
export interface FinancialInsight {
  id: string
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  value: number
  trend: "up" | "down" | "stable"
  category: string
}





// Mock function to get employee performance data
export async function getEmployeePerformance(employeeId: string): Promise<PerformanceEntry[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPerformanceData[employeeId] || []
}

// Mock function to update a performance entry
export async function updatePerformanceEntry(entry: PerformanceEntry): Promise<PerformanceEntry> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return entry
}

// Mock function to get financial insights
export async function getFinancialInsights(): Promise<FinancialInsight[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockFinancialInsights
}

// Mock function to get employee report data
export async function getEmployeeReport(employeeId: string): Promise<any> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock employee report data
  return {
    personalInfo: {
      name: employeeId === "EMP001" ? "Employee1" : "Employee2",
      position: employeeId === "EMP001" ? "" : "",
      department: "",
      joinDate: "",
      email: employeeId === "EMP001" ? "" : "",
      phone: employeeId === "EMP001" ? "" : "",
    },
    performance: {
      clientSatisfaction: employeeId === "EMP001" ? 92 : 88,
      taskCompletion: employeeId === "EMP001" ? 95 : 90,
      responseTime: employeeId === "EMP001" ? 97 : 85,
      qualityScore: employeeId === "EMP001" ? 94 : 89,
    },

    recentActivity: [
      {
        date: "2023-05-15",
        action:
          employeeId === "EMP001"
            ? ""
            : "",
      },
      {
        date: "2023-05-12",
        action: employeeId === "EMP001" ? "" : "",
      },
      {
        date: "2023-05-10",
        action:
          employeeId === "EMP001" ? "" : "",
      },
    ],
  }
}
