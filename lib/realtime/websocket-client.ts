// ==================== WebSocket 客户端实现 ====================

import type {
  ConnectionStatus,
  WSPacket,
  MessageType,
  WallMessage,
  VotePayload,
  OnlineGuest,
  PollingState,
} from "./types"

type EventCallback<T = unknown> = (data: T) => void

interface WebSocketClientConfig {
  url: string
  sessionId: string
  clientId: string
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
  enableFallback?: boolean
  fallbackPollInterval?: number
  mockMode?: boolean
}

function isV0Environment(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.location.hostname.includes("v0.dev") ||
    window.location.hostname.includes("vusercontent.com") ||
    window.location.hostname.includes("vercel.app")
  )
}

const mockMessages: WallMessage[] = [
  {
    id: "mock_1",
    guestId: "guest_1",
    guestName: "李阿姨",
    content: "祝张波和邓芮新婚快乐，百年好合！",
    likes: 15,
    likedBy: [],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "mock_2",
    guestId: "guest_2",
    guestName: "王叔叔",
    content: "早生贵子，幸福美满！洛阳的老朋友送上最诚挚的祝福！",
    likes: 12,
    likedBy: [],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: "mock_3",
    guestId: "guest_3",
    guestName: "张大伯",
    content: "侄子终于结婚了！祝你们永结同心，白头偕老！",
    likes: 8,
    likedBy: [],
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10800000,
  },
]

const mockOnlineGuests: OnlineGuest[] = [
  { id: "guest_1", name: "李阿姨", joinedAt: Date.now() - 1800000 },
  { id: "guest_2", name: "王叔叔", joinedAt: Date.now() - 3600000 },
  { id: "guest_3", name: "张大伯", joinedAt: Date.now() - 900000 },
  { id: "guest_4", name: "刘姨", joinedAt: Date.now() - 600000 },
]

/**
 * WebSocket 客户端 - 支持自动重连、轮询降级与模拟模式
 */
export class RealtimeClient {
  private ws: WebSocket | null = null
  private config: Required<WebSocketClientConfig>
  private status: ConnectionStatus = "disconnected"
  private listeners: Map<MessageType, Set<EventCallback>> = new Map()
  private statusListeners: Set<EventCallback<ConnectionStatus>> = new Set()
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private pollingState: PollingState | null = null
  private pollingTimer: NodeJS.Timeout | null = null
  private mockMessages: WallMessage[] = [...mockMessages]
  private mockOnlineGuests: OnlineGuest[] = [...mockOnlineGuests]

  constructor(config: WebSocketClientConfig) {
    const shouldUseMock = config.mockMode ?? isV0Environment()

    this.config = {
      reconnectAttempts: shouldUseMock ? 0 : 5,
      reconnectDelay: 1000,
      heartbeatInterval: 30000,
      enableFallback: !shouldUseMock,
      fallbackPollInterval: 3000,
      mockMode: shouldUseMock,
      ...config,
    }

    if (shouldUseMock) {
      console.log("[RealtimeClient] 检测到 v0 环境，启用模拟模式")
    }
  }

  // ==================== 连接管理 ====================

  connect(): void {
    if (this.config.mockMode) {
      this.setStatus("connected")
      // 模拟初始数据加载
      setTimeout(() => {
        this.mockMessages.forEach((msg) => {
          this.emit("message:new", msg)
        })
        this.emit("guest:list", this.mockOnlineGuests)
      }, 500)
      return
    }

    if (this.status === "connected" || this.status === "connecting") return

    this.setStatus("connecting")

    try {
      this.ws = new WebSocket(this.config.url)
      this.setupEventHandlers()
    } catch (error) {
      console.error("[RealtimeClient] WebSocket 连接失败:", error)
      this.handleConnectionFailure()
    }
  }

  disconnect(): void {
    this.cleanup()
    this.setStatus("disconnected")
  }

  private setupEventHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      this.setStatus("connected")
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.stopPolling()

      this.send("guest:join", {
        guestId: this.config.clientId,
        sessionId: this.config.sessionId,
      })
    }

    this.ws.onmessage = (event) => {
      try {
        const packet: WSPacket = JSON.parse(event.data)
        this.handlePacket(packet)
      } catch (error) {
        console.error("[RealtimeClient] 消息解析失败:", error)
      }
    }

    this.ws.onerror = () => {
      if (!this.config.mockMode) {
        this.handleConnectionFailure()
      }
    }

    this.ws.onclose = (event) => {
      this.stopHeartbeat()

      if (event.wasClean) {
        this.setStatus("disconnected")
      } else {
        this.handleConnectionFailure()
      }
    }
  }

  private handleConnectionFailure(): void {
    if (this.config.mockMode) {
      this.setStatus("connected")
      return
    }

    if (this.reconnectAttempts < this.config.reconnectAttempts) {
      this.setStatus("reconnecting")
      this.reconnectAttempts++

      const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

      this.reconnectTimer = setTimeout(() => {
        this.connect()
      }, delay)
    } else if (this.config.enableFallback) {
      this.startPollingFallback()
    } else {
      this.config.mockMode = true
      this.setStatus("connected")
      console.log("[RealtimeClient] 降级到模拟模式")
    }
  }

  // ==================== 降级轮询 ====================

  private startPollingFallback(): void {
    this.setStatus("fallback-polling")

    this.pollingState = {
      lastEventId: "",
      pollInterval: this.config.fallbackPollInterval,
      retryCount: 0,
      maxRetries: 3,
    }

    this.poll()
  }

  private async poll(): Promise<void> {
    if (this.status !== "fallback-polling" || !this.pollingState) return

    try {
      const response = await fetch(
        `/api/realtime/poll?sessionId=${this.config.sessionId}&lastEventId=${this.pollingState.lastEventId}`,
      )

      if (!response.ok) throw new Error("轮询请求失败")

      const { events, lastEventId } = await response.json()
      this.pollingState.lastEventId = lastEventId
      this.pollingState.retryCount = 0

      events.forEach((packet: WSPacket) => this.handlePacket(packet))
    } catch {
      if (this.pollingState) {
        this.pollingState.retryCount++
      }
    }

    this.pollingTimer = setTimeout(() => this.poll(), this.pollingState?.pollInterval || 3000)
  }

  private stopPolling(): void {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer)
      this.pollingTimer = null
    }
    this.pollingState = null
  }

  // ==================== 心跳保活 ====================

  private startHeartbeat(): void {
    if (this.config.mockMode) return

    this.heartbeatTimer = setInterval(() => {
      this.send("heartbeat", { timestamp: Date.now() })
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // ==================== 消息发送 ====================

  async sendMessage(content: string, guestName: string): Promise<WallMessage> {
    const message: WallMessage = {
      id: `msg_${Date.now()}`,
      guestId: this.config.clientId,
      guestName,
      content,
      likes: 0,
      likedBy: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    if (this.config.mockMode) {
      this.mockMessages.unshift(message)
      this.emit("message:new", message)
      return message
    }

    if (this.status === "fallback-polling") {
      const response = await fetch("/api/realtime/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.config.sessionId,
          ...message,
        }),
      })

      if (!response.ok) throw new Error("发送消息失败")
      return response.json()
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("发送超时")), 10000)

      const handler = (data: WallMessage) => {
        if (data.guestId === this.config.clientId && data.content === content) {
          clearTimeout(timeout)
          this.off("message:new", handler)
          resolve(data)
        }
      }

      this.on("message:new", handler)
      this.send("message:new", message)
    })
  }

  subscribeVotes(voteId: string, callback: EventCallback<VotePayload>): () => void {
    const handler = (payload: VotePayload) => {
      if (payload.data.voteId === voteId) {
        callback(payload)
      }
    }

    this.on("vote:update", handler)
    return () => this.off("vote:update", handler)
  }

  async getOnlineList(): Promise<OnlineGuest[]> {
    if (this.config.mockMode) {
      return this.mockOnlineGuests
    }

    if (this.status === "fallback-polling") {
      const response = await fetch(`/api/realtime/guests?sessionId=${this.config.sessionId}`)
      if (!response.ok) throw new Error("获取在线列表失败")
      return response.json()
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("请求超时")), 5000)

      const handler = (guests: OnlineGuest[]) => {
        clearTimeout(timeout)
        this.off("guest:list", handler)
        resolve(guests)
      }

      this.on("guest:list", handler)
      this.send("sync:request", { type: "guest:list" })
    })
  }

  likeMessage(messageId: string): void {
    if (this.config.mockMode) {
      const msg = this.mockMessages.find((m) => m.id === messageId)
      if (msg) {
        msg.likes++
        msg.likedBy.push(this.config.clientId)
        this.emit("message:like", msg)
      }
      return
    }

    this.send("message:like", {
      messageId,
      guestId: this.config.clientId,
    })
  }

  castVote(voteId: string, optionId: string): void {
    this.send("vote:cast", {
      voteId,
      optionId,
      guestId: this.config.clientId,
    })
  }

  private send<T>(type: MessageType, payload: T): void {
    if (this.config.mockMode) return

    const packet: WSPacket<T> = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      payload,
      timestamp: Date.now(),
      clientId: this.config.clientId,
      sessionId: this.config.sessionId,
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet))
    }
  }

  private emit<T>(type: MessageType, data: T): void {
    const callbacks = this.listeners.get(type)
    callbacks?.forEach((cb) => cb(data))
  }

  // ==================== 事件订阅 ====================

  on<T>(type: MessageType, callback: EventCallback<T>): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(callback as EventCallback)
  }

  off<T>(type: MessageType, callback: EventCallback<T>): void {
    this.listeners.get(type)?.delete(callback as EventCallback)
  }

  onStatusChange(callback: EventCallback<ConnectionStatus>): () => void {
    this.statusListeners.add(callback)
    return () => this.statusListeners.delete(callback)
  }

  private handlePacket(packet: WSPacket): void {
    const callbacks = this.listeners.get(packet.type)
    callbacks?.forEach((cb) => cb(packet.payload))
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    this.statusListeners.forEach((cb) => cb(status))
  }

  getStatus(): ConnectionStatus {
    return this.status
  }

  isMockMode(): boolean {
    return this.config.mockMode
  }

  // ==================== 清理 ====================

  private cleanup(): void {
    this.stopHeartbeat()
    this.stopPolling()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
