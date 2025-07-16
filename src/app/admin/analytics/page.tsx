"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown } from "lucide-react"

const salesReportData = {
  totalSales: "$24,580.50",
  totalOrders: 156,
  averageOrderValue: "$157.56",
  period: "Last 30 Days",
}

const productPerformance = [
  {
    id: 1,
    name: "Birthday Celebration Crate",
    unitsSold: 45,
    revenue: "$4,049.55",
    trend: "up",
    change: "+12%",
  },
  {
    id: 2,
    name: "Artisan Coffee Blend",
    unitsSold: 89,
    revenue: "$2,222.11",
    trend: "up",
    change: "+8%",
  },
  {
    id: 3,
    name: "Relaxation Ritual Box",
    unitsSold: 32,
    revenue: "$3,984.00",
    trend: "up",
    change: "+15%",
  },
  {
    id: 4,
    name: "Handcrafted Soap Set",
    unitsSold: 67,
    revenue: "$1,239.50",
    trend: "down",
    change: "-5%",
  },
  {
    id: 5,
    name: "Essential Oil Set",
    unitsSold: 23,
    revenue: "$1,035.00",
    trend: "up",
    change: "+3%",
  },
  {
    id: 6,
    name: "Gourmet Chocolate Box",
    unitsSold: 12,
    revenue: "$345.00",
    trend: "down",
    change: "-18%",
  },
]

export default function Analytics() {
  const [reportType, setReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("30days")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const generateReport = () => {
    console.log("Generating report:", { reportType, dateRange, startDate, endDate })
  }

  const exportReport = () => {
    console.log("Exporting report...")
  }

  return (
    <AdminLayout title="Analytics & Reporting">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Business Analytics</h2>
            <p className="text-sm text-gray-600">Deep insights into your business performance</p>
          </div>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Report Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="products">Product Performance</SelectItem>
                    <SelectItem value="customers">Customer Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "custom" && (
                <>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4">
              <Button onClick={generateReport}>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Report */}
        {reportType === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesReportData.totalSales}</div>
                  <div className="text-sm text-gray-500">{salesReportData.period}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesReportData.totalOrders}</div>
                  <div className="text-sm text-gray-500">{salesReportData.period}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesReportData.averageOrderValue}</div>
                  <div className="text-sm text-gray-500">{salesReportData.period}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Product Performance Report */}
        {reportType === "products" && (
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.unitsSold}</TableCell>
                      <TableCell className="font-medium">{product.revenue}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {product.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              product.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {product.change}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Customer Analytics */}
        {reportType === "customers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Customers</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returning Customers</span>
                    <span className="font-medium">109</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Retention Rate</span>
                    <span className="font-medium">69.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average CLV</span>
                    <span className="font-medium">$234.56</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top 10% CLV</span>
                    <span className="font-medium">$567.89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Order Frequency</span>
                    <span className="font-medium">3.2 orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
