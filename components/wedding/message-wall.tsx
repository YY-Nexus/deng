"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, Send, MessageCircle } from "lucide-react"
import { DraggableModal } from "@/components/draggable-modal"

interface WallMessage {
  id: string
  guestId: string
  guestName: string
  content: string
  likes: number
  likedBy: string[]
  createdAt: number
}

function getGuestId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("wedding_guest_id")
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem("wedding_guest_id", id)
  }
  return id
}

// 初始示例消息
const initialMessages: WallMessage[] = [
  {
    id: "1",
    guestId: "system",
    guestName: "王阿姨",
    content: "祝福你们百年好合，早生贵子！洛阳的牡丹见证你们的爱情 💐",
    likes: 12,
    likedBy: [],
    createdAt: Date.now() - 120000,
  },
  {
    id: "2",
    guestId: "system",
    guestName: "李叔叔",
    content: "看着你们从小长大，今天终于成家了，叔叔很欣慰！🎉",
    likes: 8,
    likedBy: [],
    createdAt: Date.now() - 300000,
  },
  {
    id: "3",
    guestId: "system",
    guestName: "大学室友",
    content: "还记得当年你说要找一个温柔的人，现在梦想成真了！永远幸福！❤️",
    likes: 15,
    likedBy: [],
    createdAt: Date.now() - 600000,
  },
  {
    id: "4",
    guestId: "system",
    guestName: "表姐",
    content: "终于等到这一天！祝你们琴瑟和鸣，白头偕老！🌹",
    likes: 10,
    likedBy: [],
    createdAt: Date.now() - 900000,
  },
  {
    id: "5",
    guestId: "system",
    guestName: "同事小刘",
    content: "老板今天最帅！新娘最美！祝福你们！🎊",
    likes: 6,
    likedBy: [],
    createdAt: Date.now() - 1200000,
  },
]

interface MessageWallProps {
  open: boolean
  onClose: () => void
}

export function MessageWall({ open, onClose }: MessageWallProps) {
  const [guestId, setGuestId] = useState("")
  const [messages, setMessages] = useState<WallMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState({ name: "", content: "" })
  const [isSending, setIsSending] = useState(false)

  // 初始化来宾ID
  useEffect(() => {
    setGuestId(getGuestId())
    // 从 localStorage 加载保存的消息
    const saved = localStorage.getItem("wedding_messages")
    if (saved) {
      try {
        const savedMessages = JSON.parse(saved) as WallMessage[]
        setMessages([...savedMessages, ...initialMessages])
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // 保存消息到 localStorage
  const saveMessages = (msgs: WallMessage[]) => {
    const userMessages = msgs.filter((m) => m.guestId !== "system")
    localStorage.setItem("wedding_messages", JSON.stringify(userMessages))
  }

  // 发送消息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.name || !newMessage.content || isSending) return

    setIsSending(true)

    // 模拟发送延迟
    await new Promise((r) => setTimeout(r, 300))

    const message: WallMessage = {
      id: `msg_${Date.now()}`,
      guestId,
      guestName: newMessage.name,
      content: newMessage.content,
      likes: 0,
      likedBy: [],
      createdAt: Date.now(),
    }

    const updatedMessages = [message, ...messages]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setNewMessage({ name: "", content: "" })
    setIsSending(false)
  }

  // 点赞
  const handleLike = (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === messageId && !m.likedBy.includes(guestId)) {
          return { ...m, likes: m.likes + 1, likedBy: [...m.likedBy, guestId] }
        }
        return m
      })
      saveMessages(updated)
      return updated
    })
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return "刚刚"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return new Date(timestamp).toLocaleDateString("zh-CN")
  }

  return (
    <DraggableModal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gold-500" />
          <span>祝福留言墙</span>
          <span className="ml-2 text-xs text-graphite-400">({messages.length}条祝福)</span>
        </div>
      }
      width={520}
      variant="glass"
    >
      <div className="space-y-5">
        {/* 发送祝福表单 */}
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-gold-50/50 border border-gold-200/30 space-y-3">
          <input
            type="text"
            placeholder="您的称呼"
            value={newMessage.name}
            onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gold-200/50 bg-white/70 
              text-graphite-700 placeholder:text-graphite-400 text-sm
              focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
          <textarea
            placeholder="写下您的祝福..."
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gold-200/50 bg-white/70 
              text-graphite-700 placeholder:text-graphite-400 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.name || !newMessage.content}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              bg-gold-500 text-white text-sm font-medium 
              hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
          >
            <Send className="h-4 w-4" />
            {isSending ? "发送中..." : "发送祝福"}
          </button>
        </form>

        {/* 留言列表 */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 rounded-xl bg-white/50 border border-gold-100 
                transition-all duration-200 hover:shadow-md hover:bg-white/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-graphite-700">{message.guestName}</span>
                    <span className="text-xs text-graphite-400">{formatTime(message.createdAt)}</span>
                    {message.guestId === guestId && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gold-100 text-gold-600">我</span>
                    )}
                  </div>
                  <p className="text-sm text-graphite-600 leading-relaxed break-words">{message.content}</p>
                </div>
                <button
                  onClick={() => handleLike(message.id)}
                  disabled={message.likedBy.includes(guestId)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all
                    ${
                      message.likedBy.includes(guestId)
                        ? "text-red-500 bg-red-50"
                        : "text-graphite-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                >
                  <Heart className={`h-4 w-4 ${message.likedBy.includes(guestId) ? "fill-current" : ""}`} />
                  <span className="text-xs font-medium">{message.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DraggableModal>
  )
}
