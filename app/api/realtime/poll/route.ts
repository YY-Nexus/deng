// ==================== 轮询降级 API ====================

import { type NextRequest, NextResponse } from "next/server"

// 模拟事件存储（生产环境应使用 Redis）
const eventStore: Map<string, Array<{ id: string; packet: unknown; timestamp: number }>> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")
  const lastEventId = searchParams.get("lastEventId") || ""

  if (!sessionId) {
    return NextResponse.json({ error: "缺少 sessionId" }, { status: 400 })
  }

  // 获取该会话的新事件
  const events = eventStore.get(sessionId) || []
  const lastIndex = lastEventId ? events.findIndex((e) => e.id === lastEventId) : -1
  const newEvents = events.slice(lastIndex + 1)

  return NextResponse.json({
    events: newEvents.map((e) => e.packet),
    lastEventId: newEvents.length > 0 ? newEvents[newEvents.length - 1].id : lastEventId,
    timestamp: Date.now(),
  })
}
