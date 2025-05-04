import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Writing Analytics</CardTitle>
          <CardDescription className="text-gray-400">
            Track your writing progress and productivity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="font-medium mb-2">Words Written This Month</div>
              <div className="text-3xl font-bold">24,567</div>
              <div className="text-sm text-green-400 mt-1">↑ 12% from last month</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="font-medium mb-2">Writing Streak</div>
              <div className="text-3xl font-bold">7 days</div>
              <div className="text-sm text-gray-400 mt-1">Keep it up!</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="font-medium mb-2">AI Assistance Usage</div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">Plot Generation</div>
                <div className="text-sm">45%</div>
              </div>
              <Progress value={45} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />

              <div className="flex justify-between items-center mb-2 mt-4">
                <div className="text-sm text-gray-400">Character Development</div>
                <div className="text-sm">30%</div>
              </div>
              <Progress value={30} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />

              <div className="flex justify-between items-center mb-2 mt-4">
                <div className="text-sm text-gray-400">Dialogue Enhancement</div>
                <div className="text-sm">25%</div>
              </div>
              <Progress value={25} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}