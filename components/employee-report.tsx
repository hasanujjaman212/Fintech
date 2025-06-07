"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEmployeeReport } from "@/lib/data"
import { Sparkles, User, Calendar, Mail, Phone, Award, Activity } from "lucide-react"

interface EmployeeReportProps {
  employeeId: string
  showFullProfile?: boolean
}

export default function EmployeeReport({ employeeId, showFullProfile = false }: EmployeeReportProps) {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState<string | null>(
    "AI Analysis: Based on performance metrics, this employee excels in client satisfaction and task completion. Consider assigning more complex client cases to leverage these strengths.",
  )

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEmployeeReport(employeeId)
        setReportData(data)
      } catch (error) {
        console.error("Failed to load employee report:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [employeeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No report data available for this employee.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFullProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {reportData.personalInfo.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{reportData.personalInfo.name}</h3>
                <p className="text-gray-600">{reportData.personalInfo.position}</p>
                <p className="text-sm text-gray-500">{reportData.personalInfo.department}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Joined: {reportData.personalInfo.joinDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">{reportData.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">{reportData.personalInfo.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="performance">
                <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="performance" className="rounded-md data-[state=active]:bg-white">
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="rounded-md data-[state=active]:bg-white">
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-md data-[state=active]:bg-white">
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Client Satisfaction</span>
                        <span className="text-sm font-medium text-gray-700">
                          {reportData.performance.clientSatisfaction}%
                        </span>
                      </div>
                      <Progress value={reportData.performance.clientSatisfaction} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Task Completion</span>
                        <span className="text-sm font-medium text-gray-700">
                          {reportData.performance.taskCompletion}%
                        </span>
                      </div>
                      <Progress value={reportData.performance.taskCompletion} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Response Time</span>
                        <span className="text-sm font-medium text-gray-700">
                          {reportData.performance.responseTime}%
                        </span>
                      </div>
                      <Progress value={reportData.performance.responseTime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Quality Score</span>
                        <span className="text-sm font-medium text-gray-700">
                          {reportData.performance.qualityScore}%
                        </span>
                      </div>
                      <Progress value={reportData.performance.qualityScore} className="h-2" />
                    </div>
                  </div>

                  {aiInsights && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>{aiInsights}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <ul className="space-y-3">
                    {reportData.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <ul className="space-y-3">
                    {reportData.recentActivity.map((activity: any, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-700">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {!showFullProfile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Employee Report: {reportData.personalInfo.name}
            </h3>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {reportData.personalInfo.position}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Client Satisfaction</span>
                    <span className="text-sm font-medium text-gray-700">
                      {reportData.performance.clientSatisfaction}%
                    </span>
                  </div>
                  <Progress value={reportData.performance.clientSatisfaction} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Task Completion</span>
                    <span className="text-sm font-medium text-gray-700">{reportData.performance.taskCompletion}%</span>
                  </div>
                  <Progress value={reportData.performance.taskCompletion} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <span className="text-sm font-medium text-gray-700">{reportData.performance.responseTime}%</span>
                  </div>
                  <Progress value={reportData.performance.responseTime} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Quality Score</span>
                    <span className="text-sm font-medium text-gray-700">{reportData.performance.qualityScore}%</span>
                  </div>
                  <Progress value={reportData.performance.qualityScore} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Recent Activity</h4>
              <ul className="space-y-3">
                {reportData.recentActivity.map((activity: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {aiInsights && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>{aiInsights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
