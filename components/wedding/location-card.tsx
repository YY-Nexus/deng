"use client"

// 任务卡 05：日程与地点页面 - 一键导航与呼叫
import { useState } from "react"
import { MapPin, Navigation, Phone, Clock, ExternalLink, Copy, Check, Car, Train } from "lucide-react"
import { cn } from "@/lib/utils"
import { weddingConfig } from "@/lib/wedding-config"
import { DraggableModal } from "@/components/draggable-modal"
import { Button } from "@/components/ui/button"

interface LocationCardProps {
  className?: string
}

// 地图平台配置
const mapPlatforms = [
  {
    id: "amap",
    name: "高德地图",
    icon: "🗺️",
    getUrl: (address: string, coords: { lat: number; lng: number }) =>
      `https://uri.amap.com/marker?position=${coords.lng},${coords.lat}&name=${encodeURIComponent(address)}&coordinate=gaode&callnative=1`,
  },
  {
    id: "baidu",
    name: "百度地图",
    icon: "📍",
    getUrl: (address: string, coords: { lat: number; lng: number }) =>
      `https://api.map.baidu.com/marker?location=${coords.lat},${coords.lng}&title=${encodeURIComponent(address)}&output=html&coord_type=gcj02`,
  },
  {
    id: "apple",
    name: "Apple 地图",
    icon: "🍎",
    getUrl: (address: string, coords: { lat: number; lng: number }) =>
      `https://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${coords.lat},${coords.lng}`,
  },
  {
    id: "google",
    name: "Google 地图",
    icon: "🌐",
    getUrl: (address: string, coords: { lat: number; lng: number }) =>
      `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`,
  },
]

// 从 weddingConfig.groom.phone 改为 weddingConfig.couple.groomPhone
const contacts = [
  {
    id: "groom",
    name: `新郎 ${weddingConfig.couple.groom}`,
    phone: weddingConfig.couple.groomPhone,
    role: "新郎",
    avatar: "🤵",
  },
  {
    id: "bride",
    name: `新娘 ${weddingConfig.couple.bride}`,
    phone: weddingConfig.couple.bridePhone,
    role: "新娘",
    avatar: "👰",
  },
]

export function LocationCard({ className }: LocationCardProps) {
  const [showNavModal, setShowNavModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const { venue } = weddingConfig
  const coordinates = venue.coordinates // 使用实际的坐标数据

  // 复制地址
  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(venue.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 打开地图导航
  const handleOpenMap = (platform: (typeof mapPlatforms)[0]) => {
    const url = platform.getUrl(venue.address, coordinates)
    window.open(url, "_blank")
    setShowNavModal(false)
  }

  // 发起呼叫
  const handleCall = (contact: (typeof contacts)[0]) => {
    setSelectedContact(contact)
    setShowCallModal(true)
  }

  // 确认呼叫
  const confirmCall = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact.phone}`
      // TODO: 记录呼叫日志到后端
      setShowCallModal(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          "rounded-2xl overflow-hidden",
          "bg-graphite-800/50 border border-gold-500/20",
          "backdrop-blur-sm",
          className,
        )}
      >
        {/* 地图预览 */}
        <div className="relative h-48 bg-gradient-to-br from-gold-600/20 via-gold-500/10 to-graphite-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gold-400 mx-auto mb-2" />
              <p className="text-gold-100 font-medium">{venue.name}</p>
            </div>
          </div>
          {/* 装饰性网格 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(212,168,71,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212,168,71,0.3) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* 信息区域 */}
        <div className="p-6 space-y-4">
          {/* 地址 */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gold-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-gold-100 font-medium">{venue.name}</p>
              <p className="text-gold-400/70 text-sm mt-1">{venue.address}</p>
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-gold-400 hover:text-gold-300 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "已复制" : "复制地址"}
              </button>
            </div>
          </div>

          {/* 时间 */}
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gold-400 shrink-0" />
            <div>
              <p className="text-gold-100">
                {weddingConfig.date.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}{" "}
                {weddingConfig.lunarDate}
              </p>
              <p className="text-gold-400/70 text-sm">上午 11:30 吉时</p>
            </div>
          </div>

          {/* 交通提示 */}
          <div className="flex items-start gap-3 pt-3 border-t border-gold-500/10">
            <div className="flex gap-2">
              <Car className="h-5 w-5 text-gold-400/60" />
              <Train className="h-5 w-5 text-gold-400/60" />
            </div>
            <p className="text-gold-400/60 text-sm">
              自驾可导航至酒店，地下停车场免费；乘坐地铁1号线至市中心站，步行约10分钟
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={() => setShowNavModal(true)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-graphite-900 font-medium transition-colors"
            >
              <Navigation className="h-4 w-4" />
              一键导航
            </Button>
            <Button
              onClick={() => handleCall(contacts[0])}
              variant="outline"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-gold-500/30 text-gold-300 hover:bg-gold-500/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              联系新人
            </Button>
          </div>
        </div>
      </div>

      {/* 导航选择弹窗 */}
      <DraggableModal
        open={showNavModal}
        onClose={() => setShowNavModal(false)}
        title="选择导航应用"
        width={360}
        variant="glass-dark"
      >
        <div className="space-y-3">
          <p className="text-gold-400/70 text-sm mb-4">将为您导航至：{venue.address}</p>

          {mapPlatforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleOpenMap(platform)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl",
                "bg-graphite-700/50 border border-gold-500/20",
                "hover:border-gold-500/40 hover:bg-graphite-700/70",
                "transition-all duration-200",
              )}
            >
              <span className="text-2xl">{platform.icon}</span>
              <span className="text-gold-100 font-medium">{platform.name}</span>
              <ExternalLink className="h-4 w-4 text-gold-400/50 ml-auto" />
            </button>
          ))}
        </div>
      </DraggableModal>

      {/* 呼叫确认弹窗 */}
      <DraggableModal
        open={showCallModal}
        onClose={() => setShowCallModal(false)}
        title="联系新人"
        width={340}
        variant="glass-dark"
      >
        <div className="space-y-4">
          {/* 联系人选择 */}
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl",
                  "border transition-all duration-200",
                  selectedContact?.id === contact.id
                    ? "border-gold-500 bg-gold-500/20"
                    : "border-gold-500/20 bg-graphite-700/50 hover:border-gold-500/40",
                )}
              >
                <span className="text-3xl">{contact.avatar}</span>
                <span className="text-gold-100 text-sm font-medium">{contact.role}</span>
                <span className="text-gold-400/60 text-xs">{contact.phone}</span>
              </button>
            ))}
          </div>

          {/* 确认呼叫 */}
          {selectedContact && (
            <div className="pt-4 border-t border-gold-500/20">
              <p className="text-gold-400/70 text-sm text-center mb-4">确认拨打 {selectedContact.name} 的电话？</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCallModal(false)}
                  variant="outline"
                  className="border-gold-500/30 text-gold-300"
                >
                  取消
                </Button>
                <Button onClick={confirmCall} className="bg-gold-500 hover:bg-gold-400 text-graphite-900">
                  <Phone className="h-4 w-4 mr-2" />
                  立即拨打
                </Button>
              </div>
            </div>
          )}
        </div>
      </DraggableModal>
    </>
  )
}
