// ==================== WebSocket 服务端架构设计 ====================

import type { WSPacket, WallMessage, VotePayload, OnlineGuest, ConnectionMetrics, ServerEvent } from "./types"

/**
 * 服务端架构说明（伪代码 + 设计文档）
 *
 * 该文件描述服务端 WebSocket 处理器的架构设计，
 * 实际部署时应使用 Node.js + ws 或 Socket.io
 */

// ==================== 连接池管理 ====================

interface ConnectionPool {
  // 会话 -> 客户端连接映射
  sessions: Map<string, Set<WebSocket>>
  // 客户端 -> 连接信息映射
  clients: Map<string, ClientInfo>
  // 连接数监控
  metrics: ConnectionMetrics
}

interface ClientInfo {
  id: string
  sessionId: string
  socket: WebSocket
  guest: OnlineGuest
  connectedAt: number
  lastPingAt: number
}

// ==================== 消息处理器接口 ====================

interface MessageHandler {
  handleMessage(packet: WSPacket): Promise<ServerEvent | null>
}

/**
 * 消息广播处理器
 */
class MessageBroadcastHandler implements MessageHandler {
  constructor(
    private pool: ConnectionPool,
    private db: DatabaseAdapter,
  ) {}

  async handleMessage(packet: WSPacket): Promise<ServerEvent | null> {
    switch (packet.type) {
      case "message:new":
        return this.handleNewMessage(packet)
      case "message:like":
        return this.handleLike(packet)
      default:
        return null
    }
  }

  private async handleNewMessage(packet: WSPacket<Partial<WallMessage>>): Promise<ServerEvent> {
    // 1. 持久化到数据库
    const message = await this.db.messages.create({
      ...packet.payload,
      id: generateId(),
      createdAt: Date.now(),
    })

    // 2. 广播给同会话所有客户端
    return {
      type: "broadcast",
      packet: {
        ...packet,
        payload: message,
      },
    }
  }

  private async handleLike(packet: WSPacket<{ messageId: string; guestId: string }>): Promise<ServerEvent> {
    const { messageId, guestId } = packet.payload

    // 原子性更新点赞数
    const message = await this.db.messages.updateLike(messageId, guestId)

    return {
      type: "broadcast",
      packet: {
        ...packet,
        type: "message:like",
        payload: message,
      },
    }
  }
}

/**
 * 投票处理器 - 支持并发控制
 */
class VoteHandler implements MessageHandler {
  private voteLocks: Map<string, Promise<unknown>> = new Map()

  constructor(
    private pool: ConnectionPool,
    private db: DatabaseAdapter,
  ) {}

  async handleMessage(packet: WSPacket): Promise<ServerEvent | null> {
    if (packet.type !== "vote:cast") return null

    const { voteId, optionId, guestId } = packet.payload as VotePayload["data"]

    const lockKey = `${voteId}:${guestId}`

    if (this.voteLocks.has(lockKey)) {
      // 等待之前的投票完成
      await this.voteLocks.get(lockKey)
    }

    const votePromise = this.processVote(voteId, optionId, guestId, packet)
    this.voteLocks.set(lockKey, votePromise)

    try {
      return await votePromise
    } finally {
      this.voteLocks.delete(lockKey)
    }
  }

  private async processVote(voteId: string, optionId: string, guestId: string, packet: WSPacket): Promise<ServerEvent> {
    // 使用数据库事务确保原子性
    const result = await this.db.transaction(async (tx) => {
      // 检查是否已投票
      const existingVote = await tx.votes.findByGuestId(voteId, guestId)
      if (existingVote) {
        throw new Error("已经投过票了")
      }

      // 记录投票
      await tx.votes.create({ voteId, optionId, guestId, timestamp: Date.now() })

      // 更新计数
      const updatedVote = await tx.voteItems.incrementOption(voteId, optionId)

      return updatedVote
    })

    return {
      type: "broadcast",
      packet: {
        ...packet,
        type: "vote:update",
        payload: result,
      },
    }
  }
}

// ==================== 水平扩展策略 ====================

/**
 * 使用 Redis Pub/Sub 实现多实例消息同步
 */
interface ScalingStrategy {
  // 发布消息到所有实例
  publish(channel: string, event: ServerEvent): Promise<void>
  // 订阅消息
  subscribe(channel: string, handler: (event: ServerEvent) => void): void
  // 获取全局在线列表（跨实例）
  getGlobalOnlineList(sessionId: string): Promise<OnlineGuest[]>
}

class RedisScalingAdapter implements ScalingStrategy {
  constructor(private redis: RedisClient) {}

  async publish(channel: string, event: ServerEvent): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(event))
  }

  subscribe(channel: string, handler: (event: ServerEvent) => void): void {
    this.redis.subscribe(channel, (message) => {
      handler(JSON.parse(message))
    })
  }

  async getGlobalOnlineList(sessionId: string): Promise<OnlineGuest[]> {
    // 从 Redis Set 获取所有实例的在线用户
    const guests = await this.redis.smembers(`session:${sessionId}:guests`)
    return guests.map((g) => JSON.parse(g))
  }
}

// ==================== 类型占位符（仅用于类型检查） ====================

type WebSocket = { send: (data: string) => void; close: () => void }
type RedisClient = {
  publish: (channel: string, message: string) => Promise<void>
  subscribe: (channel: string, handler: (message: string) => void) => void
  smembers: (key: string) => Promise<string[]>
}
type DatabaseAdapter = {
  messages: {
    create: (data: Partial<WallMessage>) => Promise<WallMessage>
    updateLike: (id: string, guestId: string) => Promise<WallMessage>
  }
  votes: {
    findByGuestId: (voteId: string, guestId: string) => Promise<unknown>
    create: (data: Record<string, unknown>) => Promise<void>
  }
  voteItems: {
    incrementOption: (voteId: string, optionId: string) => Promise<unknown>
  }
  transaction: <T>(fn: (tx: DatabaseAdapter) => Promise<T>) => Promise<T>
}
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export type { ConnectionPool, MessageHandler, ScalingStrategy, ClientInfo }
