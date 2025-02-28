"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download, ImageIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import debounce from "lodash/debounce"
import CustomQR from "@/components/custom-qr"

// QR code style presets with enhanced styling options
const QR_STYLES = {
  classic: {
    fgColor: "#000000",
    bgColor: "#FFFFFF",
    cornerRadius: 0,
    dotScale: 1,
  },
  modern: {
    fgColor: "#1E40AF",
    bgColor: "#FFFFFF",
    cornerRadius: 12,
    dotScale: 0.95,
  },
  vibrant: {
    fgColor: "#7C3AED",
    bgColor: "#FFFFFF",
    cornerRadius: 16,
    dotScale: 1,
  },
  corporate: {
    fgColor: "#0F766E",
    bgColor: "#FFFFFF",
    cornerRadius: 8,
    dotScale: 0.9,
  },
  minimal: {
    fgColor: "#525252",
    bgColor: "#FFFFFF",
    cornerRadius: 4,
    dotScale: 0.8,
  },
  gradient: {
    fgColor: "#4F46E5",
    bgColor: "#FFFFFF",
    cornerRadius: 12,
    dotScale: 1,
  },
}

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("modern")
  const [customStyle, setCustomStyle] = useState({
    fgColor: "#1E40AF",
    bgColor: "#FFFFFF",
    cornerRadius: 12,
    dotScale: 0.95,
  })
  const [activeTab, setActiveTab] = useState("preset")

  const qrRef = useRef<HTMLDivElement>(null)

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogo(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoUrl(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Debounced style update
  const debouncedStyleUpdate = useCallback(
    debounce((newStyle) => {
      setCustomStyle(newStyle)
    }, 100),
    [],
  )

  // Download QR code
  const downloadQRCode = () => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector("canvas")
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "qrcode.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Get current style
  const getCurrentStyle = () => {
    return activeTab === "preset" ? QR_STYLES[selectedStyle as keyof typeof QR_STYLES] : customStyle
  }

  // Handle style changes
  const handleStyleChange = (value: string) => {
    setSelectedStyle(value)
    const newStyle = QR_STYLES[value as keyof typeof QR_STYLES]
    setCustomStyle(newStyle)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 transition-all">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">QR Code Generator</CardTitle>
              <CardDescription className="text-lg">Create beautiful QR codes with custom styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-base">
                  Website URL
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    placeholder="Enter URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      setError("")
                    }}
                    className="flex-1 text-lg"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-base">
                  Logo (Optional)
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="logo-upload"
                      className={cn(
                        "flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer",
                        "transition-all duration-200 ease-in-out",
                        "hover:border-primary hover:bg-primary/5",
                      )}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl || "/placeholder.svg"}
                          alt="Logo preview"
                          className="h-24 w-24 object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Click to upload logo</span>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                  {logoUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLogo(null)
                        setLogoUrl("")
                      }}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Style Options */}
              <div className="space-y-4">
                <Label className="text-base">QR Code Style</Label>
                <Tabs defaultValue="preset" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preset">Preset Styles</TabsTrigger>
                    <TabsTrigger value="custom">Custom Style</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preset" className="space-y-4 pt-4">
                    <Select value={selectedStyle} onValueChange={handleStyleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern Blue</SelectItem>
                        <SelectItem value="vibrant">Vibrant Purple</SelectItem>
                        <SelectItem value="corporate">Corporate Teal</SelectItem>
                        <SelectItem value="minimal">Minimal Gray</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-6 pt-4">
                    <div className="grid gap-6">
                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fgColor">QR Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="fgColor"
                              value={customStyle.fgColor}
                              onChange={(e) =>
                                debouncedStyleUpdate({
                                  ...customStyle,
                                  fgColor: e.target.value,
                                })
                              }
                              className="w-12 h-10 p-1 rounded-lg"
                            />
                            <Input
                              type="text"
                              value={customStyle.fgColor}
                              onChange={(e) =>
                                debouncedStyleUpdate({
                                  ...customStyle,
                                  fgColor: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bgColor">Background</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              id="bgColor"
                              value={customStyle.bgColor}
                              onChange={(e) =>
                                debouncedStyleUpdate({
                                  ...customStyle,
                                  bgColor: e.target.value,
                                })
                              }
                              className="w-12 h-10 p-1 rounded-lg"
                            />
                            <Input
                              type="text"
                              value={customStyle.bgColor}
                              onChange={(e) =>
                                debouncedStyleUpdate({
                                  ...customStyle,
                                  bgColor: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Corner Radius */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Corner Radius</Label>
                          <span className="text-sm text-muted-foreground">{customStyle.cornerRadius}px</span>
                        </div>
                        <Slider
                          value={[customStyle.cornerRadius]}
                          min={0}
                          max={16}
                          step={1}
                          onValueChange={([value]) =>
                            debouncedStyleUpdate({
                              ...customStyle,
                              cornerRadius: value,
                            })
                          }
                          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                      </div>

                      {/* Dot Scale */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Dot Size</Label>
                          <span className="text-sm text-muted-foreground">
                            {(customStyle.dotScale * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Slider
                          value={[customStyle.dotScale]}
                          min={0.5}
                          max={1}
                          step={0.05}
                          onValueChange={([value]) =>
                            debouncedStyleUpdate({
                              ...customStyle,
                              dotScale: value,
                            })
                          }
                          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
              <div
                ref={qrRef}
                className={cn("p-8 bg-white rounded-xl shadow-sm transition-all duration-200", "hover:shadow-lg")}
              >
                {url ? (
                  <CustomQR
                    value={url.startsWith("http") ? url : `https://${url}`}
                    size={300}
                    style={getCurrentStyle()}
                    logoUrl={logoUrl}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] w-[300px] border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground text-center">Enter a URL to generate QR code</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={downloadQRCode} disabled={!url || isGenerating} className="w-full max-w-sm" size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

