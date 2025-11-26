"use client"

// 任务卡 06：来宾管理 UI
import { useState, useMemo, useEffect } from "react"
import { Search, Users, Download, UserCheck, UserX, Clock, Utensils, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Guest {
  id: string
  name: string
  phone: string
  status: "confirmed" | "declined" | "pending"
  guestCount: number
  dietaryPreference: string
  seatPreference: string
  message?: string
  submittedAt: number
}

// 模拟数据
const mockGuests: Guest[] = [
  {
    id: "1",
    name: "王叔叔",
    phone: "138****1234",
    status: "confirmed",
    guestCount: 4,
    dietaryPreference: "无特殊要求",
    seatPreference: "front",
    message: "祝新人百年好合！",
    submittedAt: Date.now() - 86400000,
  },
  {
    id: "2",
    name: "李阿姨",
    phone: "139****5678",
    status: "confirmed",
    guestCount: 2,
    dietaryPreference: "素食",
    seatPreference: "middle",
    submittedAt: Date.now() - 172800000,
  },
  {
    id: "3",
    name: "张伯伯",
    phone: "136****9012",
    status: "confirmed",
    guestCount: 2,
    dietaryPreference: "无特殊要求",
    seatPreference: "front",
    message: "早生贵子！",
    submittedAt: Date.now() - 259200000,
  },
  {
    id: "4",
    name: "刘姨",
    phone: "135****3456",
    status: "pending",
    guestCount: 1,
    dietaryPreference: "无特殊要求",
    seatPreference: "no-preference",
    submittedAt: Date.now() - 43200000,
  },
]

interface GuestListProps {
  className?: string
}

type FilterStatus = "all" | "confirmed" | "declined" | "pending"

export function GuestList({ className }: GuestListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [guests, setGuests] = useState<Guest[]>(mockGuests)

  useEffect(() => {
    const loadRSVP = () => {
      try {
        const saved = localStorage.getItem("wedding_rsvp")
        if (saved) {
          const rsvpList = JSON.parse(saved) as Array<{
            name: string
            phone: string
            attendStatus: string
            guestCount: number
            dietaryPreference: string
            message?: string
            submittedAt: number
          }>

          const rsvpGuests: Guest[] = rsvpList.map((r, i) => ({
            id: `rsvp_${i}`,
            name: r.name,
            phone: r.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
            status:
              r.attendStatus === "attending"
                ? "confirmed"
                : r.attendStatus === "not-attending"
                  ? "declined"
                  : "pending",
            guestCount: r.guestCount || 1,
            dietaryPreference:
              r.dietaryPreference === "none"
                ? "无特殊要求"
                : r.dietaryPreference === "vegetarian"
                  ? "素食"
                  : r.dietaryPreference === "halal"
                    ? "清真"
                    : "其他",
            seatPreference: "no-preference",
            message: r.message,
            submittedAt: r.submittedAt,
          }))

          // 合并模拟数据和实际提交的数据
          setGuests([...rsvpGuests, ...mockGuests])
        }
      } catch (e) {
        // ignore
      }
    }

    loadRSVP()
  }, [])

  const handleRefresh = () => {
    try {
      const saved = localStorage.getItem("wedding_rsvp")
      if (saved) {
        const rsvpList = JSON.parse(saved) as Array<{
          name: string
          phone: string
          attendStatus: string
          guestCount: number
          dietaryPreference: string
          message?: string
          submittedAt: number
        }>

        const rsvpGuests: Guest[] = rsvpList.map((r, i) => ({
          id: `rsvp_${i}`,
          name: r.name,
          phone: r.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
          status:
            r.attendStatus === "attending" ? "confirmed" : r.attendStatus === "not-attending" ? "declined" : "pending",
          guestCount: r.guestCount || 1,
          dietaryPreference:
            r.dietaryPreference === "none"
              ? "无特殊要求"
              : r.dietaryPreference === "vegetarian"
                ? "素食"
                : r.dietaryPreference === "halal"
                  ? "清真"
                  : "其他",
          seatPreference: "no-preference",
          message: r.message,
          submittedAt: r.submittedAt,
        }))

        setGuests([...rsvpGuests, ...mockGuests])
      }
    } catch (e) {
      // ignore
    }
  }

  // 过滤来宾
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || guest.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [guests, searchQuery, filterStatus])

  // 统计数据
  const stats = useMemo(() => {
    const confirmed = guests.filter((g) => g.status === "confirmed")
    const totalGuests = confirmed.reduce((sum, g) => sum + g.guestCount, 0)
    const vegetarian = confirmed.filter((g) => g.dietaryPreference === "素食").length

    return {
      total: guests.length,
      confirmed: confirmed.length,
      declined: guests.filter((g) => g.status === "declined").length,
      pending: guests.filter((g) => g.status === "pending").length,
      totalGuests,
      vegetarian,
    }
  }, [guests])

  // 导出 CSV
  const handleExport = () => {
    const headers = ["姓名", "电话", "状态", "人数", "饮食偏好", "留言"]
    const rows = guests.map((g) => [
      g.name,
      g.phone,
      g.status === "confirmed" ? "已确认" : g.status === "declined" ? "已谢绝" : "待定",
      g.guestCount.toString(),
      g.dietaryPreference,
      g.message || "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "来宾名单.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusConfig = {
    confirmed: { icon: UserCheck, label: "已确认", color: "text-green-400 bg-green-500/20" },
    declined: { icon: UserX, label: "已谢绝", color: "text-red-400 bg-red-500/20" },
    pending: { icon: Clock, label: "待定", color: "text-yellow-400 bg-yellow-500/20" },
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "总邀请", value: stats.total, color: "text-gold-400" },
          { label: "已确认", value: stats.confirmed, color: "text-green-400" },
          { label: "待回复", value: stats.pending, color: "text-yellow-400" },
          { label: "出席人数", value: stats.totalGuests, color: "text-gold-300" },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl bg-graphite-700/50 border border-gold-500/10 text-center">
            <p className={cn("text-xl font-medium", stat.color)}>{stat.value}</p>
            <p className="text-gold-400/60 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索来宾姓名..."
            className="pl-9 bg-graphite-700/50 border-gold-500/20 text-gold-100 placeholder:text-gold-400/40"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-graphite-700/50 border border-gold-500/20">
          {(["all", "confirmed", "pending", "declined"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs transition-colors",
                filterStatus === status ? "bg-gold-500/20 text-gold-100" : "text-gold-400/60 hover:text-gold-300",
              )}
            >
              {status === "all" ? "全部" : statusConfig[status].label}
            </button>
          ))}
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="border-gold-500/30 text-gold-300 bg-transparent"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="border-gold-500/30 text-gold-300 bg-transparent"
        >
          <Download className="h-4 w-4 mr-1" />
          导出
        </Button>
      </div>

      {/* 来宾列表 */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredGuests.length === 0 ? (
          <div className="py-8 text-center text-gold-400/50">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>暂无匹配的来宾</p>
          </div>
        ) : (
          filteredGuests.map((guest) => {
            const StatusIcon = statusConfig[guest.status].icon

            return (
              <div
                key={guest.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-graphite-700/30 border border-gold-500/10 hover:border-gold-500/20 transition-colors"
              >
                {/* 头像 */}
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-300 font-medium">
                  {guest.name.charAt(0)}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gold-100 font-medium truncate">{guest.name}</p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                        statusConfig[guest.status].color,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[guest.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gold-400/60 text-xs">{guest.phone}</span>
                    {guest.status === "confirmed" && (
                      <>
                        <span className="text-gold-400/40 text-xs">|</span>
                        <span className="text-gold-400/60 text-xs flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {guest.guestCount}人
                        </span>
                        {guest.dietaryPreference !== "无特殊要求" && (
                          <>
                            <span className="text-gold-400/40 text-xs">|</span>
                            <span className="text-gold-400/60 text-xs flex items-center gap-1">
                              <Utensils className="h-3 w-3" />
                              {guest.dietaryPreference}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {guest.message && <p className="text-gold-400/50 text-xs mt-1 truncate">"{guest.message}"</p>}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 饮食统计 */}
      {stats.vegetarian > 0 && (
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
          <p className="text-gold-300 text-sm">
            <Utensils className="h-4 w-4 inline mr-2" />
            素食需求：{stats.vegetarian} 位宾客
          </p>
        </div>
      )}
    </div>
  )
}
