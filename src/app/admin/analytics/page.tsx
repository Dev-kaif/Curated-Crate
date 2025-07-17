"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

export default function Analytics() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        reportType,
        dateRange,
      });
      if (dateRange === "custom") {
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
      }
      const { data } = await axios.get(
        `/api/admin/analytics?${params.toString()}`
      );
      if (data.success) {
        setReportData(data.data);
      } else {
        throw new Error(data.message || "Failed to generate report");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [reportType, dateRange, startDate, endDate]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const exportReport = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === "sales") {
      headers = ["Metric", "Value"];
      rows = [
        ["Total Sales", reportData.totalSales.toFixed(2)],
        ["Total Orders", reportData.totalOrders],
        ["Average Order Value", reportData.averageOrderValue.toFixed(2)],
      ];
    } else if (reportType === "products" && Array.isArray(reportData)) {
      headers = ["Product Name", "Units Sold", "Total Revenue"];
      rows = reportData.map((p) => [p.name, p.unitsSold, p.revenue.toFixed(2)]);
    } else if (reportType === "customers") {
      headers = ["Metric", "Value"];
      rows = [
        ["New Customers", reportData.newCustomers],
        ["Returning Customers", reportData.returningCustomers],
        ["Average Lifetime Value", reportData.averageCLV.toFixed(2)],
      ];
    }

    csvContent += headers.join(",") + "\r\n";
    rows.forEach((rowArray) => {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Analytics & Reporting">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Business Analytics</h2>
            <p className="text-sm text-gray-600">
              Deep insights into your business performance
            </p>
          </div>
          <Button onClick={exportReport} disabled={isLoading || !reportData}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="products">
                      Product Performance
                    </SelectItem>
                    <SelectItem value="customers">
                      Customer Analytics
                    </SelectItem>
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
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Report Display Area */}
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          reportData && (
            <>
              {reportType === "sales" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Sales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${reportData.totalSales.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reportData.period}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.totalOrders}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reportData.period}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Average Order Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${reportData.averageOrderValue.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reportData.period}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.unitsSold}</TableCell>
                            <TableCell className="font-medium">
                              ${product.revenue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {reportType === "customers" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.newCustomers}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Returning Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.returningCustomers}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Lifetime Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${reportData.averageCLV.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )
        )}
      </div>
    </AdminLayout>
  );
}
