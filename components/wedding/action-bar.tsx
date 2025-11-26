"use client"

import { useState } from "react"
import { Music, MessageSquare, ClipboardList, Users, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { MusicPlayer } from "./music-player"
import { RSVPModal } from "./rsvp-modal"
import { MessageWall } from "./message-wall"
import { GuestList } from "./guest-list"
import { LocationCard } from "./location-card"
import { DraggableModal } from "@/components/draggable-modal"

type ModalType = "music" | "rsvp" | "messages" | "guests" | "location" | null

const actions = [
  { id: "music" as const, icon: Music, label: "音乐" },
  { id: "rsvp" as const, icon: ClipboardList, label: "回执" },
  { id: "messages" as const, icon: MessageSquare, label: "留言" },
  { id: "guests" as const, icon: Users, label: "来宾" },
  { id: "location" as const, icon: MapPin, label: "导航" },
]

export function ActionBar() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const handleClose = () => {
    setActiveModal(null)
  }

  return (
    <>
      {/* 底部固定操作栏 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div
          className={cn(
            "flex items-center gap-1 sm:gap-2 p-2 rounded-2xl",
            "bg-graphite-900/80 backdrop-blur-lg",
            "border border-gold-500/20",
            "shadow-2xl shadow-graphite-900/50",
          )}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveModal(action.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200",
                "text-gold-300 hover:text-gold-100 hover:bg-gold-500/20",
                activeModal === action.id && "bg-gold-500/20 text-gold-100",
              )}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 模态框 - 确保每个模态框正确接收 open 和 onClose */}
      <MusicPlayer open={activeModal === "music"} onClose={handleClose} />

      <RSVPModal open={activeModal === "rsvp"} onClose={handleClose} />

      <MessageWall open={activeModal === "messages"} onClose={handleClose} />

      <DraggableModal
        open={activeModal === "guests"}
        onClose={handleClose}
        title="来宾名单"
        width={600}
        variant="glass-dark"
      >
        <GuestList />
      </DraggableModal>

      <DraggableModal
        open={activeModal === "location"}
        onClose={handleClose}
        title="婚礼地点"
        width={420}
        variant="glass-dark"
      >
        <LocationCard className="border-0 bg-transparent" />
      </DraggableModal>
    </>
  )
}
