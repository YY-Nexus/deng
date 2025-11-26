// ==================== WebSocket 实时服务类型定义 ====================

// 连接状态
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting" | "fallback-polling"

// 消息类型
export type MessageType =
  | "message:new"
  | "message:like"
  | "message:delete"
  | "vote:cast"
  | "vote:update"
  | "guest:join"
  | "guest:leave"
  | "guest:list"
  | "sync:request"
  | "sync:response"
  | "heartbeat"
  | "error"

// ==================== 留言墙相关 ====================

export interface WallMessage {
  id: string
  guestId: string
  guestName: string
  guestAvatar?: string
  content: string
  likes: number
  likedBy: string[]
  createdAt: number
  updatedAt: number
}

export interface MessagePayload {
  type: "message:new" | "message:like" | "message:delete"
  data: WallMessage | { messageId: string; guestId: string }
  timestamp: number
}

// ==================== 投票相关 ====================

export interface VoteItem {
  id: string
  title: string
  description?: string
  options: VoteOption[]
  totalVotes: number
  createdAt: number
  expiresAt?: number
  isActive: boolean
}

export interface VoteOption {
  id: string
  label: string
  voteCount: number
  voterIds: string[]
  percentage: number
}

export interface VotePayload {
  type: "vote:cast" | "vote:update"
  data: {
    voteId: string
    optionId: string
    guestId: string
    voteCount?: number
  }
  timestamp: number
}

// ==================== 在线来宾相关 ====================

export interface OnlineGuest {
  id: string
  name: string
  avatar?: string
  role: "bride-side" | "groom-side" | "family" | "friend" | "colleague"
  joinedAt: number
  lastActiveAt: number
  deviceType: "mobile" | "desktop" | "tablet"
}

export interface GuestPayload {
  type: "guest:join" | "guest:leave" | "guest:list"
  data: OnlineGuest | OnlineGuest[] | { guestId: string }
  timestamp: number
}

// ==================== WebSocket 消息包 ====================

export interface WSPacket<T = unknown> {
  id: string
  type: MessageType
  payload: T
  timestamp: number
  clientId: string
  sessionId: string
}

// ==================== 服务端事件 ====================

export interface ServerEvent {
  type: "broadcast" | "unicast" | "multicast"
  target?: string | string[]
  packet: WSPacket
}

// ==================== 降级轮询相关 ====================

export interface PollingState {
  lastEventId: string
  pollInterval: number
  retryCount: number
  maxRetries: number
}

// ==================== 连接监控 ====================

export interface ConnectionMetrics {
  totalConnections: number
  activeConnections: number
  messagesPerSecond: number
  averageLatency: number
  errorRate: number
  uptime: number
}
