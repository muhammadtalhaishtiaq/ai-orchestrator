"use client"

import Link from "next/link"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Zap,
  BarChart3,
  MessageSquare,
  Clock,
  Award,
  Edit
} from "lucide-react"

const stats = [
  { label: "Total Chats", value: "1,247", icon: MessageSquare },
  { label: "Queries Today", value: "34", icon: BarChart3 },
  { label: "Hours Saved", value: "128", icon: Clock },
  { label: "Achievements", value: "12", icon: Award },
]

const recentActivity = [
  { action: "Analyzed sales trends", time: "10 minutes ago", type: "analysis" },
  { action: "Generated revenue forecast", time: "2 hours ago", type: "forecast" },
  { action: "Customer segmentation", time: "Yesterday", type: "analysis" },
  { action: "Updated notification settings", time: "2 days ago", type: "settings" },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1a30] to-[#0a0e1a]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="w-10 h-10 rounded-lg bg-[#0d1a30]/60 border border-cyan-500/20 flex items-center justify-center hover:border-cyan-500/40 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-sm text-gray-500">View and manage your account</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0d1a30]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-500/50 flex items-center justify-center">
                  <User className="w-12 h-12 text-cyan-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0d1a30] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin User</h2>
                <p className="text-gray-400">Enterprise Plan Member</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    admin@projectnebula.ai
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Joined Jan 2024
                  </div>
                </div>
              </div>
            </div>
            <Link href="/settings">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0e1a]/60 border border-cyan-500/20 rounded-lg text-gray-300 hover:border-cyan-500/40 transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </Link>
          </div>

          {/* Plan Badge */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">Enterprise Plan</p>
              <p className="text-xs text-gray-500">Unlimited access to all features</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Manage Plan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-[#0d1a30]/60 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0d1a30]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "analysis" ? "bg-cyan-400" :
                    activity.type === "forecast" ? "bg-purple-400" :
                    "bg-gray-400"
                  }`} />
                  <span className="text-sm text-gray-300">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
