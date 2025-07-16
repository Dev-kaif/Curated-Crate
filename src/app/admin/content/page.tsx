"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Eye, AlertCircle } from "lucide-react"

export default function ContentManagement() {
  const [announcementData, setAnnouncementData] = useState({
    text: "Free shipping on orders over $75! Use code FREESHIP75",
    isActive: true,
  })

  const [heroData, setHeroData] = useState({
    headline: "Discover Your Perfect Curated Experience",
    subheadline:
      "Thoughtfully selected products delivered to your door, tailored to create meaningful moments and lasting memories.",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Saving content:", { announcementData, heroData })

    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const previewChanges = () => {
    console.log("Opening preview with:", { announcementData, heroData })
    // This would open a preview of the site with the changes
  }

  return (
    <AdminLayout title="Content Management">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Site Content</h2>
            <p className="text-sm text-gray-600">Update your website content without touching code</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={previewChanges}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Content updated successfully! Changes are now live on your website.
            </AlertDescription>
          </Alert>
        )}

        {/* Announcement Banner */}
        <Card>
          <CardHeader>
            <CardTitle>Announcement Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="banner-active">Display Banner</Label>
                <p className="text-sm text-gray-500">Show announcement banner at the top of your site</p>
              </div>
              <Switch
                id="banner-active"
                checked={announcementData.isActive}
                onCheckedChange={(checked) => setAnnouncementData((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div>
              <Label htmlFor="banner-text">Banner Text</Label>
              <Input
                id="banner-text"
                value={announcementData.text}
                onChange={(e) => setAnnouncementData((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your announcement text"
                disabled={!announcementData.isActive}
              />
              <p className="text-sm text-gray-500 mt-1">
                Keep it short and compelling. This will appear at the very top of your website.
              </p>
            </div>

            {/* Preview */}
            {announcementData.isActive && (
              <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800 text-center font-medium">Preview: {announcementData.text}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Landing Page Hero */}
        <Card>
          <CardHeader>
            <CardTitle>Landing Page Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-headline">Main Headline</Label>
              <Input
                id="hero-headline"
                value={heroData.headline}
                onChange={(e) => setHeroData((prev) => ({ ...prev, headline: e.target.value }))}
                placeholder="Enter your main headline"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is the first thing visitors see. Make it compelling and clear.
              </p>
            </div>

            <div>
              <Label htmlFor="hero-subheadline">Sub-headline</Label>
              <Textarea
                id="hero-subheadline"
                value={heroData.subheadline}
                onChange={(e) => setHeroData((prev) => ({ ...prev, subheadline: e.target.value }))}
                placeholder="Enter your sub-headline"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide more detail about your value proposition. 2-3 sentences work best.
              </p>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">{heroData.headline}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{heroData.subheadline}</p>
                <div className="text-sm text-gray-400">↑ Preview of how this will appear on your homepage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Content Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <span className="font-medium">Update Footer</span>
                <span className="text-sm text-gray-500">Contact info, links, etc.</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <span className="font-medium">Manage FAQ</span>
                <span className="text-sm text-gray-500">Add or edit FAQ items</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <span className="font-medium">About Page</span>
                <span className="text-sm text-gray-500">Update company story</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <span className="font-medium">Legal Pages</span>
                <span className="text-sm text-gray-500">Terms, Privacy, etc.</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
