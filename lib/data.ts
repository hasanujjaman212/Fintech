// Mock data for employee performance
export interface PerformanceEntry {
  id: string
  serialNumber: number
  name: string
  email: string
  mobileNumber: string
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

// Mock financial insights data
const mockFinancialInsights: FinancialInsight[] = [
  {
    id: "fi1",
    title: "Revenue Growth",
    description: "15% increase from last quarter",
    impact: "positive",
    value: 15,
    trend: "up",
    category: "revenue",
  },
  {
    id: "fi2",
    title: "New Clients",
    description: "12 new clients this month",
    impact: "positive",
    value: 12,
    trend: "up",
    category: "clients",
  },
  {
    id: "fi3",
    title: "Processing Time",
    description: "Decreased by 8% this month",
    impact: "positive",
    value: 8,
    trend: "down",
    category: "efficiency",
  },
  {
    id: "fi4",
    title: "Market Volatility",
    description: "Increased market uncertainty",
    impact: "negative",
    value: 5,
    trend: "up",
    category: "risk",
  },
]

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

  // Mock employee report data for Admin
  return {
    personalInfo: {
      name: "Administrator",
      position: "System Administrator",
      department: "Management",
      joinDate: "2020-01-01",
      email: "admin@fintechsolutions.com",
      phone: "+1-555-0001",
      mobileNumber: "+1-555-0001",
    },
    performance: {
      clientSatisfaction: 98,
      taskCompletion: 100,
      responseTime: 95,
      qualityScore: 97,
    },
    achievements: [
      "System setup and configuration completed",
      "Database optimization implemented",
      "Security protocols established",
      "AI integration successfully deployed",
    ],
    recentActivity: [
      {
        date: "2023-12-15",
        action: "Database schema updated with mobile number field",
      },
      {
        date: "2023-12-14",
        action: "Performance monitoring system enhanced",
      },
      {
        date: "2023-12-13",
        action: "AI assistant capabilities expanded",
      },
    ],
  }
}
