"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Key, 
  Globe, 
  Zap,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check
} from "lucide-react"

const settingsSections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Manage your account details and preferences"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Configure alerts and notification preferences"
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password, 2FA, and security settings"
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Customize theme and display options"
  },
  {
    id: "data",
    label: "Data Controls",
    icon: Database,
    description: "Manage your data and privacy settings"
  },
  {
    id: "api",
    label: "API Keys",
    icon: Key,
    description: "Manage API access and integrations"
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    description: "Set your preferred language and timezone"
  },
  {
    id: "performance",
    label: "Performance",
    icon: Zap,
    description: "Configure AI model and response settings"
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("appearance")
  const [theme, setTheme] = useState("dark")

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1a30] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="w-10 h-10 rounded-lg bg-[#0d1a30]/60 border border-cyan-500/20 flex items-center justify-center hover:border-cyan-500/40 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-500">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#0d1a30]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 border border-cyan-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <section.icon className={`w-5 h-5 ${activeSection === section.id ? "text-cyan-400" : "text-gray-500"}`} />
                  <span className={`text-sm ${activeSection === section.id ? "text-gray-200" : "text-gray-400"}`}>
                    {section.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#0d1a30]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
              {activeSection === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Appearance</h2>
                    <p className="text-sm text-gray-500">Customize how Project Nebula looks on your device</p>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-300">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Monitor },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                            theme === option.id
                              ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/50"
                              : "bg-[#0a0e1a]/50 border-cyan-500/20 hover:border-cyan-500/30"
                          }`}
                        >
                          <option.icon className={`w-6 h-6 ${theme === option.id ? "text-cyan-400" : "text-gray-500"}`} />
                          <span className={`text-sm ${theme === option.id ? "text-gray-200" : "text-gray-400"}`}>
                            {option.label}
                          </span>
                          {theme === option.id && (
                            <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-300">Accent Color</h3>
                    <div className="flex gap-3">
                      {["cyan", "purple", "pink", "green", "orange"].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                            color === "cyan" ? "bg-cyan-500 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0d1a30]" :
                            color === "purple" ? "bg-purple-500" :
                            color === "pink" ? "bg-pink-500" :
                            color === "green" ? "bg-green-500" :
                            "bg-orange-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-300">Font Size</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">A</span>
                      <input 
                        type="range" 
                        min="12" 
                        max="20" 
                        defaultValue="14"
                        className="flex-1 h-2 bg-[#0a0e1a] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <span className="text-lg text-gray-500">A</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Profile</h2>
                    <p className="text-sm text-gray-500">Manage your personal information</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/30 flex items-center justify-center">
                      <User className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                      <input 
                        type="text" 
                        defaultValue="Admin"
                        className="w-full bg-[#0a0e1a]/60 border border-cyan-500/20 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        defaultValue="User"
                        className="w-full bg-[#0a0e1a]/60 border border-cyan-500/20 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@projectnebula.ai"
                      className="w-full bg-[#0a0e1a]/60 border border-cyan-500/20 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeSection !== "appearance" && activeSection !== "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {settingsSections.find(s => s.id === activeSection)?.label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {settingsSections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#0a0e1a]/60 border border-cyan-500/20 flex items-center justify-center mb-4">
                        {(() => {
                          const Icon = settingsSections.find(s => s.id === activeSection)?.icon || Shield
                          return <Icon className="w-8 h-8 text-gray-500" />
                        })()}
                      </div>
                      <p className="text-gray-500">Settings coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
