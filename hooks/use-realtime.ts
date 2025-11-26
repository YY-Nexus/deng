"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { RealtimeClient } from "@/lib/realtime/websocket-client"
import type { ConnectionStatus, WallMessage, OnlineGuest, VotePayload } from "@/lib/realtime/types"

interface UseRealtimeOptions {
  sessionId: string
  guestId: string
  wsUrl?: string
}

interface UseRealtimeReturn {
  // 连接状态
  status: ConnectionStatus
  isConnected: boolean
  isFallback: boolean

  // 留言墙
  messages: WallMessage[]
  sendMessage: (content: string, guestName: string) => Promise<void>
  likeMessage: (messageId: string) => void

  // 在线列表
  onlineGuests: OnlineGuest[]
  refreshOnlineList: () => Promise<void>

  // 投票
  castVote: (voteId: string, optionId: string) => void
  subscribeVotes: (voteId: string, callback: (payload: VotePayload) => void) => () => void
}

export function useRealtime({ sessionId, guestId, wsUrl }: UseRealtimeOptions): UseRealtimeReturn {
  const clientRef = useRef<RealtimeClient | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [messages, setMessages] = useState<WallMessage[]>([])
  const [onlineGuests, setOnlineGuests] = useState<OnlineGuest[]>([])

  // 初始化客户端
  useEffect(() => {
    const url = wsUrl || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/ws`

    const client = new RealtimeClient({
      url,
      sessionId,
      clientId: guestId,
      enableFallback: true,
    })

    clientRef.current = client

    // 订阅状态变化
    const unsubStatus = client.onStatusChange(setStatus)

    // 订阅消息更新
    client.on<WallMessage>("message:new", (message) => {
      setMessages((prev) => [message, ...prev])
    })

    client.on<WallMessage>("message:like", (message) => {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)))
    })

    // 订阅在线列表
    client.on<OnlineGuest>("guest:join", (guest) => {
      setOnlineGuests((prev) => [...prev.filter((g) => g.id !== guest.id), guest])
    })

    client.on<{ guestId: string }>("guest:leave", ({ guestId: leftId }) => {
      setOnlineGuests((prev) => prev.filter((g) => g.id !== leftId))
    })

    client.on<OnlineGuest[]>("guest:list", setOnlineGuests)

    // 连接
    client.connect()

    return () => {
      unsubStatus()
      client.disconnect()
    }
  }, [sessionId, guestId, wsUrl])

  // 发送消息
  const sendMessage = useCallback(async (content: string, guestName: string) => {
    if (!clientRef.current) throw new Error("未连接")
    await clientRef.current.sendMessage(content, guestName)
  }, [])

  // 点赞
  const likeMessage = useCallback((messageId: string) => {
    clientRef.current?.likeMessage(messageId)
  }, [])

  // 刷新在线列表
  const refreshOnlineList = useCallback(async () => {
    if (!clientRef.current) return
    const guests = await clientRef.current.getOnlineList()
    setOnlineGuests(guests)
  }, [])

  // 投票
  const castVote = useCallback((voteId: string, optionId: string) => {
    clientRef.current?.castVote(voteId, optionId)
  }, [])

  // 订阅投票更新
  const subscribeVotes = useCallback((voteId: string, callback: (payload: VotePayload) => void) => {
    if (!clientRef.current) return () => {}
    return clientRef.current.subscribeVotes(voteId, callback)
  }, [])

  return {
    status,
    isConnected: status === "connected",
    isFallback: status === "fallback-polling",
    messages,
    sendMessage,
    likeMessage,
    onlineGuests,
    refreshOnlineList,
    castVote,
    subscribeVotes,
  }
}
