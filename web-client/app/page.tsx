"use client"

import { useState, useCallback, useEffect } from "react"
import Sidebar, { chatHistoryData } from "@/components/sidebar"
import ChatSection from "@/components/chat-section"
import SystemInternals from "@/components/system-internals"
import { createSession, sendMessage, listSessions, getSessionMessages } from "@/lib/chat"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  hasChart?: boolean
}

export default function ProjectNebula() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isNewChat, setIsNewChat] = useState(true)
  const [sessions, setSessions] = useState<{ _id?: string; id?: string; title?: string; created_at?: string }[]>([])

  useEffect(() => {
    listSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
  }, [])

  // Handle selecting a chat from sidebar
  const handleSelectChat = useCallback((chatId: string | null) => {
    if (chatId === null) {
      setActiveChatId(null)
      setActiveSessionId(null)
      setMessages([])
      setIsNewChat(true)
      return
    }

    const realSession = sessions.find(s => (s.id || s._id) === chatId)
    if (realSession) {
      setActiveChatId(chatId)
      setActiveSessionId(chatId)
      setIsNewChat(false)

      getSessionMessages(chatId)
        .then((msgs) => {
          const displayMessages: Message[] = msgs.map((msg, index) => ({
            id: `${chatId}-${index}`,
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
            timestamp: msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
          }))
          setMessages(displayMessages)
        })
        .catch(() => {
          setMessages([])
        })

      return
    }

    // Find the chat in history (static demo data)
    for (const group of chatHistoryData) {
      const chat = group.chats.find(c => c.id === chatId)
      if (chat && chat.messages) {
        setActiveChatId(chatId)
        setActiveSessionId(null) // demo chat only (no backend session)
        setIsNewChat(false)
        
        // Convert stored messages to display format
        const displayMessages: Message[] = chat.messages.map((msg, index) => ({
          id: `${chatId}-${index}`,
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.content,
          timestamp: chat.date === "Today" ? "10:42 AM" : "Yesterday",
          hasChart: msg.role === "ai" && chatId === "1" && index === 1 // Show chart for first chat's AI response
        }))
        
        setMessages(displayMessages)
        return
      }
    }
  }, [sessions])

  // Handle new chat
  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
    setActiveSessionId(null)
    setMessages([])
    setIsNewChat(true)
  }, [])

  // Handle sending a message
  const handleSendMessage = useCallback(async (content: string) => {
    let sessionId = activeSessionId

    if (!sessionId) {
      const newSession = await createSession()
      sessionId = newSession.session_id
      setActiveSessionId(sessionId)
      setActiveChatId(sessionId)
      setSessions((prev) => [
        { id: sessionId, title: "New Chat", created_at: newSession.created_at },
        ...prev,
      ])
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsNewChat(false)

    const response = await sendMessage(sessionId, content)

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.response,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hasChart: response.has_chart,
    }

    setMessages(prev => [...prev, aiResponse])
  }, [activeSessionId])

  return (
    <div className="h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1a30] to-[#0a0e1a]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InN0YXIiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ1cmwoI3N0YXIpIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI1MCIgcj0iMC41IiBmaWxsPSJ1cmwoI3N0YXIpIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjE4MCIgcj0iMC43IiBmaWxsPSJ1cmwoI3N0YXIpIiBvcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSIxNDAiIHI9IjAuNiIgZmlsbD0idXJsKCNzdGFyKSIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIxMDAiIHI9IjAuNCIgZmlsbD0idXJsKCNzdGFyKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-40" />
      
      {/* Nebula glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

      {/* Main content */}
      <div className="relative z-10 flex h-full">
        {/* ChatGPT-style Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          activeChatId={activeChatId}
          sessions={sessions}
        />
        
        {/* Main Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300">
          {/* Header */}
          <header className="shrink-0 py-4 px-6">
            <h1 className="text-center">
              <span className="text-xl md:text-2xl font-bold tracking-[0.2em] bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                PROJECT NEBULA
              </span>
              <span className="text-xl md:text-2xl font-bold tracking-wider text-gray-400 ml-2">
                - HYBRID AI ORCHESTRATOR
              </span>
            </h1>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 px-6 pb-6 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Chat Section - Takes 2 columns */}
              <div className="lg:col-span-2 min-h-0">
                <ChatSection 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isNewChat={isNewChat}
                />
              </div>
              
              {/* System Internals - Takes 1 column */}
              <div className="lg:col-span-1 min-h-0 overflow-auto scrollbar-thin">
                <SystemInternals />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
