"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Plus, 
  MessageSquare, 
  Search,
  Settings,
  User,
  Trash2,
  Pencil,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  CreditCard,
  HelpCircle,
  Moon
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export interface ChatSession {
  id: string
  title: string
  date: string
  messages?: { role: "user" | "ai"; content: string }[]
}

export interface ChatHistoryGroup {
  label: string
  chats: ChatSession[]
}

export const chatHistoryData: ChatHistoryGroup[] = [
  {
    label: "Today",
    chats: [
      { 
        id: "1", 
        title: "Analyze the sales trends", 
        date: "Today",
        messages: [
          { role: "user", content: "Analyze the sales trends" },
          { role: "ai", content: "Analysis complete. Based on the last quarter's data, we've identified a 15% month-over-month growth in the enterprise sector, driven by new subscription models. Conversely, consumer product sales have shown a slight dip, correlating with seasonal shifts.\n\nThe predictive model suggests a potential 20% surge in overall revenue by next quarter if current trajectory is maintained." }
        ]
      },
      { 
        id: "2", 
        title: "Revenue forecast Q1 2024", 
        date: "Today",
        messages: [
          { role: "user", content: "Can you generate a revenue forecast for Q1 2024?" },
          { role: "ai", content: "Based on current trends and historical data, here's the Q1 2024 revenue forecast:\n\n1. Enterprise Segment: $4.2M (projected 18% growth)\n2. Consumer Segment: $2.8M (projected 5% growth)\n3. New Markets: $800K (new revenue stream)\n\nTotal Projected Revenue: $7.8M\n\nKey drivers include the new enterprise subscription model and expansion into Asian markets." }
        ]
      },
    ],
  },
  {
    label: "Yesterday",
    chats: [
      { 
        id: "3", 
        title: "Customer segmentation analysis", 
        date: "Yesterday",
        messages: [
          { role: "user", content: "Perform customer segmentation analysis" },
          { role: "ai", content: "I've completed the customer segmentation analysis. Here are the key segments identified:\n\n1. Enterprise Champions (22%): High-value, long-term customers\n2. Growth Prospects (35%): Mid-tier with expansion potential\n3. Cost-Sensitive (28%): Price-driven decision makers\n4. At-Risk (15%): Declining engagement patterns\n\nRecommendation: Focus retention efforts on At-Risk segment while nurturing Growth Prospects." }
        ]
      },
      { 
        id: "4", 
        title: "Marketing campaign ROI", 
        date: "Yesterday",
        messages: [
          { role: "user", content: "What's the ROI on our latest marketing campaigns?" },
          { role: "ai", content: "Marketing Campaign ROI Analysis:\n\n1. Social Media Campaign: 340% ROI\n   - Spend: $45,000 | Revenue: $198,000\n\n2. Email Marketing: 520% ROI\n   - Spend: $12,000 | Revenue: $74,400\n\n3. PPC Advertising: 180% ROI\n   - Spend: $80,000 | Revenue: $224,000\n\nTop performer: Email marketing continues to deliver the highest ROI." }
        ]
      },
    ],
  },
  {
    label: "Previous 7 Days",
    chats: [
      { 
        id: "5", 
        title: "Supply chain optimization", 
        date: "5 days ago",
        messages: [
          { role: "user", content: "How can we optimize our supply chain?" },
          { role: "ai", content: "Supply Chain Optimization Recommendations:\n\n1. Implement just-in-time inventory (save 23% on storage)\n2. Consolidate shipping routes (reduce costs by 15%)\n3. Automate order processing (decrease lead time by 2 days)\n4. Add secondary suppliers for critical components\n\nEstimated annual savings: $1.2M" }
        ]
      },
      { 
        id: "6", 
        title: "Employee performance metrics", 
        date: "6 days ago",
        messages: [
          { role: "user", content: "Show me employee performance metrics" },
          { role: "ai", content: "Employee Performance Summary Q4:\n\n- Average productivity score: 87%\n- Goal completion rate: 92%\n- Employee satisfaction: 4.2/5\n- Turnover rate: 8% (below industry avg)\n\nTop departments: Engineering (94%), Sales (91%), Support (89%)" }
        ]
      },
      { 
        id: "7", 
        title: "Product inventory status", 
        date: "7 days ago",
        messages: [
          { role: "user", content: "What's our current inventory status?" },
          { role: "ai", content: "Current Inventory Status:\n\n- Total SKUs: 2,847\n- Stock levels: 78% optimal\n- Low stock alerts: 12 items\n- Overstock items: 34 items\n\nAction needed: Reorder priority items within 5 days to avoid stockouts." }
        ]
      },
    ],
  },
  {
    label: "Previous 30 Days",
    chats: [
      { 
        id: "8", 
        title: "Annual budget planning", 
        date: "2 weeks ago",
        messages: [
          { role: "user", content: "Help me with annual budget planning" },
          { role: "ai", content: "Annual Budget Planning Framework:\n\n1. Revenue Projections: $32M (15% growth target)\n2. Operating Expenses: $24M\n3. R&D Investment: $4M (12.5% of revenue)\n4. Marketing Budget: $2.5M\n5. Contingency: $1.5M\n\nRecommended allocation adjustments based on Q4 performance data included." }
        ]
      },
      { 
        id: "9", 
        title: "Competitor analysis report", 
        date: "3 weeks ago",
        messages: [
          { role: "user", content: "Generate a competitor analysis report" },
          { role: "ai", content: "Competitor Analysis Report:\n\nTop 3 Competitors:\n1. TechCorp: 28% market share, strong in enterprise\n2. DataFlow: 22% market share, best pricing\n3. AIVentures: 15% market share, innovative features\n\nOur position: 18% market share\nKey differentiator: Superior AI capabilities and customer support\n\nOpportunity: Target DataFlow's price-sensitive customers with value messaging." }
        ]
      },
    ],
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  onSelectChat: (chatId: string | null) => void
  onNewChat: () => void
  activeChatId: string | null
  sessions?: { _id?: string; id?: string; title?: string; created_at?: string }[]
}

export default function Sidebar({ isCollapsed, onToggle, onSelectChat, onNewChat, activeChatId, sessions }: SidebarProps) {
  const { user, logout } = useAuth()
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Filter chat history based on search query
  const filteredChatHistory = useMemo(() => {
    const hasSessions = sessions && sessions.length > 0
    const source = hasSessions
      ? [
          {
            label: "Recent",
            chats: sessions.map((s, index) => ({
              id: s.id || s._id || `session-${index}`,
              title: s.title || "New Chat",
              date: s.created_at ? new Date(s.created_at).toLocaleDateString() : "",
            })),
          },
        ]
      : chatHistoryData

    if (!searchQuery.trim()) return source

    const query = searchQuery.toLowerCase()
    return source
      .map(group => ({
        ...group,
        chats: group.chats.filter(chat => chat.title.toLowerCase().includes(query))
      }))
      .filter(group => group.chats.length > 0)
  }, [searchQuery, sessions])

  const handleNewChat = () => {
    setSearchQuery("")
    onNewChat()
  }

  // Collapsed state
  if (isCollapsed) {
    return (
      <aside className="w-16 flex flex-col bg-[#0a0e1a]/95 backdrop-blur-xl border-r border-cyan-500/20 h-full transition-all duration-300">
        {/* Toggle Button */}
        <div className="p-3">
          <button 
            onClick={onToggle}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50 flex items-center justify-center transition-all"
          >
            <PanelLeft className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pb-3">
          <button 
            onClick={handleNewChat}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mini Chat List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          {chatHistoryData[0]?.chats.slice(0, 5).map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeChatId === chat.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 border border-cyan-500/30"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeChatId === chat.id ? "text-cyan-400" : "text-gray-500"}`} />
            </button>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="p-3 border-t border-cyan-500/20 space-y-2">
          <Link href="/settings">
            <button className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
              <Settings className="w-5 h-5 text-gray-500 hover:text-cyan-400" />
            </button>
          </Link>
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/30 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-400" />
            </button>
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-72 flex flex-col bg-[#0a0e1a]/95 backdrop-blur-xl border-r border-cyan-500/20 h-full transition-all duration-300">
      {/* Header with Toggle */}
      <div className="p-3 flex items-center gap-2">
        <button 
          onClick={onToggle}
          className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors shrink-0"
        >
          <PanelLeftClose className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
        </button>
        <button 
          onClick={handleNewChat}
          className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-200 font-medium text-sm">New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1a30]/60 border border-cyan-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin">
        {filteredChatHistory.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-gray-500 text-sm">No chats found</p>
          </div>
        ) : (
          filteredChatHistory.map((group) => (
            <div key={group.label}>
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group relative ${
                      activeChatId === chat.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 border border-cyan-500/30"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <MessageSquare
                      className={`w-4 h-4 shrink-0 ${
                        activeChatId === chat.id ? "text-cyan-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`flex-1 text-sm truncate ${
                        activeChatId === chat.id ? "text-gray-200" : "text-gray-400"
                      }`}
                    >
                      {chat.title}
                    </span>
                    
                    {/* Action buttons on hover */}
                    {hoveredChat === chat.id && (
                      <div className="flex items-center gap-1 absolute right-2">
                        <button className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-cyan-500/20 relative">
        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#0d1a30] border border-cyan-500/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden">
            <div className="p-2">
              <Link href="/profile">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">My Profile</span>
                </button>
              </Link>
              <Link href="/settings">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Settings</span>
                </button>
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Subscription</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                <Moon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Appearance</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Help & FAQ</span>
              </button>
            </div>
            <div className="border-t border-cyan-500/20 p-2">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Log out</span>
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/30 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-200">{user?.full_name || user?.email || "User"}</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-all ${isProfileOpen ? "rotate-90" : ""}`} />
        </button>
        
        <Link href="/settings">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors mt-1">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-400">Settings</span>
          </button>
        </Link>
      </div>
    </aside>
  )
}
