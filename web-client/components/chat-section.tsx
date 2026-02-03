"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Send, Paperclip, Mic, Sparkles, MessageSquare } from "lucide-react"
import RevenueChart from "@/components/revenue-chart"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  hasChart?: boolean
}

interface ChatSectionProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isNewChat: boolean
}

export default function ChatSection({ messages, onSendMessage, isNewChat }: ChatSectionProps) {
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Empty state for new chat
  if (isNewChat && messages.length === 0) {
    return (
      <div className="h-full bg-gradient-to-br from-[#0d1a30]/60 to-[#0a1628]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex flex-col relative overflow-hidden">
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
            <MessageSquare className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
          <p className="text-gray-400 text-center max-w-md mb-8">
            Start a conversation with Project Nebula AI. Ask about sales trends, generate reports, or analyze your business data.
          </p>
          
          {/* Suggestion chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
            {[
              "Analyze sales trends for Q4",
              "Generate revenue forecast",
              "Customer segmentation analysis",
              "Marketing campaign ROI"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(suggestion)
                  inputRef.current?.focus()
                }}
                className="px-4 py-3 rounded-xl bg-[#0a0e1a]/60 border border-cyan-500/20 hover:border-cyan-500/40 text-gray-300 text-sm text-left transition-all hover:bg-cyan-500/5"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 inline mr-2" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-cyan-500/20 relative z-10">
          <div className="relative flex items-end gap-2 bg-[#0a0e1a]/60 rounded-xl border border-cyan-500/20 focus-within:border-cyan-500/40 transition-colors">
            {/* Attachment Button */}
            <button className="p-3 text-gray-500 hover:text-cyan-400 transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Project Nebula..."
              rows={1}
              className="flex-1 bg-transparent py-3 text-gray-200 placeholder:text-gray-500 resize-none focus:outline-none text-sm max-h-32"
              style={{ minHeight: "24px" }}
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-1 p-2 shrink-0">
              <button className="p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                  inputValue.trim()
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/30"
                    : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p className="text-center text-xs text-gray-600 mt-2">
            Project Nebula can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#0d1a30]/60 to-[#0a1628]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex flex-col relative overflow-hidden">
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-4">
            {message.role === "user" ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                U
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 font-bold text-sm">Ai</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={message.role === "user" ? "text-white font-semibold" : "text-cyan-400 font-semibold"}>
                  {message.role === "user" ? "User:" : "Project Nebula AI:"}
                </span>
                <span className="text-gray-500 text-sm">{message.timestamp}</span>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>

              {/* Chart Section for AI response */}
              {message.hasChart && (
                <div className="mt-4 h-[280px] bg-[#0a0e1a]/50 rounded-xl border border-cyan-500/10 p-4 relative">
                  <RevenueChart />
                  
                  {/* Play button */}
                  <button className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 flex items-center justify-center shrink-0">
              <span className="text-cyan-400 font-bold text-sm">Ai</span>
            </div>
            <div className="flex items-center gap-1 pt-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-cyan-500/20 relative z-10">
        <div className="relative flex items-end gap-2 bg-[#0a0e1a]/60 rounded-xl border border-cyan-500/20 focus-within:border-cyan-500/40 transition-colors">
          {/* Attachment Button */}
          <button className="p-3 text-gray-500 hover:text-cyan-400 transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Project Nebula..."
            rows={1}
            className="flex-1 bg-transparent py-3 text-gray-200 placeholder:text-gray-500 resize-none focus:outline-none text-sm max-h-32"
            style={{ minHeight: "24px" }}
          />

          {/* Right side buttons */}
          <div className="flex items-center gap-1 p-2 shrink-0">
            <button className="p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                inputValue.trim()
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/30"
                  : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-600 mt-2">
          Project Nebula can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
