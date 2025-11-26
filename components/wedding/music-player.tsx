"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ThumbsUp,
  Users,
  Wifi,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { weddingConfig } from "@/lib/wedding-config"
import { DraggableModal } from "@/components/draggable-modal"

type MusicCategory = "entrance" | "tea" | "dinner" | "farewell"

interface Track {
  id: string
  name: string
  artist: string
  duration: string
  url: string
}

const categoryLabels: Record<MusicCategory, string> = {
  entrance: "进场",
  tea: "敬茶",
  dinner: "用餐",
  farewell: "送客",
}

const categoryEmoji: Record<MusicCategory, string> = {
  entrance: "💒",
  tea: "🍵",
  dinner: "🍽️",
  farewell: "👋",
}

interface MusicPlayerProps {
  open: boolean
  onClose: () => void
}

function useFadeAudio(audioRef: React.RefObject<HTMLAudioElement | null>, duration = 800) {
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
  }

  const fadeIn = useCallback(
    (targetVolume: number) => {
      const audio = audioRef.current
      if (!audio) return

      clearFade()
      audio.volume = 0
      audio.play().catch(() => {})

      const steps = 20
      const stepTime = duration / steps
      const volumeStep = targetVolume / steps
      let step = 0

      fadeIntervalRef.current = setInterval(() => {
        step++
        audio.volume = Math.min(volumeStep * step, targetVolume)
        if (step >= steps) clearFade()
      }, stepTime)
    },
    [audioRef, duration],
  )

  const fadeOut = useCallback(
    (callback?: () => void) => {
      const audio = audioRef.current
      if (!audio) {
        callback?.()
        return
      }

      clearFade()
      const startVol = audio.volume
      const steps = 20
      const stepTime = duration / steps
      const volumeStep = startVol / steps
      let step = 0

      fadeIntervalRef.current = setInterval(() => {
        step++
        audio.volume = Math.max(startVol - volumeStep * step, 0)
        if (step >= steps) {
          clearFade()
          audio.pause()
          callback?.()
        }
      }, stepTime)
    },
    [audioRef, duration],
  )

  useEffect(() => clearFade, [])

  return { fadeIn, fadeOut }
}

function useVolumeMemory(key = "wedding-player-volume") {
  const [volume, setVolumeState] = useState(0.7)

  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved) setVolumeState(Number.parseFloat(saved))
  }, [key])

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v)
      localStorage.setItem(key, v.toString())
    },
    [key],
  )

  return { volume, setVolume }
}

export function MusicPlayer({ open, onClose }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { volume, setVolume } = useVolumeMemory()
  const { fadeIn, fadeOut } = useFadeAudio(audioRef)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<MusicCategory>("entrance")
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [guestId] = useState(() => `guest-${Date.now()}`)
  const [audioError, setAudioError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentPlaylist = (weddingConfig.musicLibrary[currentCategory] || []) as Track[]
  const currentTrack = currentPlaylist[currentTrackIndex] || {
    id: "",
    name: "暂无曲目",
    artist: "",
    duration: "0:00",
    url: "",
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setIsLoading(false)
      setAudioError(false)
    }
    const onEnded = () => handleNext()
    const onError = () => {
      setAudioError(true)
      setIsLoading(false)
      setIsPlaying(false)
    }
    const onLoadStart = () => {
      setIsLoading(true)
      setAudioError(false)
    }
    const onCanPlay = () => {
      setIsLoading(false)
      setAudioError(false)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)
    audio.addEventListener("loadstart", onLoadStart)
    audio.addEventListener("canplay", onCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
      audio.removeEventListener("loadstart", onLoadStart)
      audio.removeEventListener("canplay", onCanPlay)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlayPause = () => {
    if (audioError) {
      // 如果有错误，显示提示
      return
    }
    if (isPlaying) {
      fadeOut(() => setIsPlaying(false))
    } else {
      setIsPlaying(true)
      fadeIn(volume)
    }
  }

  const handlePrev = () => {
    if (currentPlaylist.length === 0) return
    fadeOut(() => {
      setCurrentTrackIndex((prev) => (prev === 0 ? currentPlaylist.length - 1 : prev - 1))
      setProgress(0)
      setTimeout(() => fadeIn(volume), 100)
    })
  }

  const handleNext = () => {
    if (currentPlaylist.length === 0) return
    fadeOut(() => {
      setCurrentTrackIndex((prev) => (prev === currentPlaylist.length - 1 ? 0 : prev + 1))
      setProgress(0)
      setTimeout(() => fadeIn(volume), 100)
    })
  }

  const voteTrack = async (trackId: string, visitorId: string) => {
    const voteKey = `vote-${trackId}-${visitorId}`
    if (localStorage.getItem(voteKey)) {
      return { success: false, trackId, voteCount: votes[trackId] || 0, message: "您已投过票" }
    }

    localStorage.setItem(voteKey, "true")
    const newCount = (votes[trackId] || 0) + 1
    setVotes((prev) => ({ ...prev, [trackId]: newCount }))

    return { success: true, trackId, voteCount: newCount }
  }

  const handleVote = async () => {
    if (!currentTrack.id) return
    await voteTrack(currentTrack.id, guestId)
  }

  const syncPosition = async (sessionId: string) => {
    setIsSyncing(true)
    await new Promise((r) => setTimeout(r, 500))
    setIsSyncing(false)

    return {
      sessionId,
      position: audioRef.current?.currentTime || 0,
      trackId: currentTrack.id,
      timestamp: Date.now(),
      isHost: true,
    }
  }

  const handleCategoryChange = (category: MusicCategory) => {
    fadeOut(() => {
      setCurrentCategory(category)
      setCurrentTrackIndex(0)
      setProgress(0)
      setTimeout(() => {
        if (isPlaying) fadeIn(volume)
      }, 100)
    })
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    setProgress(newTime)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <DraggableModal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-gold-500" />
          <span>婚礼音乐</span>
          {isSyncing && <Wifi className="h-4 w-4 text-green-500 animate-pulse" />}
        </div>
      }
      width={440}
      variant="glass"
    >
      <audio ref={audioRef} src={currentTrack?.url || undefined} preload="metadata" />

      <div className="space-y-5">
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">音乐文件提示</p>
              <p className="text-xs mt-1 text-amber-600">
                请将音乐文件放置到 <code className="bg-amber-100 px-1 rounded">public/audio/</code> 目录下，
                文件名格式如：entrance-1.mp3、tea-1.mp3 等。共需 20 首音乐文件。
              </p>
            </div>
          </div>
        </div>

        {/* 分类切换 */}
        <div className="flex gap-2">
          {(Object.keys(categoryLabels) as MusicCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300",
                currentCategory === category
                  ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 scale-105"
                  : "bg-gold-100/60 text-graphite-600 hover:bg-gold-100 hover:scale-102",
              )}
            >
              <span className="mr-1">{categoryEmoji[category]}</span>
              {categoryLabels[category]}
              <span className="ml-1 text-xs opacity-70">({(weddingConfig.musicLibrary[category] || []).length})</span>
            </button>
          ))}
        </div>

        {/* 当前播放 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gold-100/60 to-gold-50/40 border border-gold-200/50">
          <div className="flex items-center gap-4">
            {/* 封面 */}
            <div className="relative w-18 h-18 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl overflow-hidden group">
              <Music
                className={cn(
                  "h-8 w-8 text-white transition-transform",
                  isPlaying && "animate-pulse",
                  isLoading && "animate-spin",
                )}
              />
              {audioError && (
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-graphite-800 truncate text-lg">{currentTrack.name}</h4>
              <p className="text-sm text-graphite-500">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-graphite-400">{formatTime(progress)}</span>
                <span className="text-xs text-graphite-300">/</span>
                <span className="text-xs text-graphite-400">{currentTrack.duration || formatTime(duration)}</span>
                {isLoading && <span className="text-xs text-gold-500 animate-pulse">加载中...</span>}
                {audioError && <span className="text-xs text-red-500">无法加载</span>}
              </div>
            </div>

            {/* 投票按钮 */}
            <button
              onClick={handleVote}
              className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gold-100 transition-all hover:scale-110 active:scale-95"
              aria-label="为这首歌投票"
            >
              <ThumbsUp className="h-5 w-5 text-gold-600" />
              <span className="text-xs font-medium text-graphite-600">{votes[currentTrack.id] || 0}</span>
            </button>
          </div>

          {/* 进度条 */}
          <div className="mt-5">
            <div onClick={handleSeek} className="h-2 rounded-full bg-gold-200/60 cursor-pointer overflow-hidden group">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 transition-all duration-100 relative"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-5 mt-5">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full text-graphite-500 hover:bg-gold-100 hover:text-graphite-700 transition-all hover:scale-110 active:scale-95"
              aria-label="上一首"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className={cn(
                "p-4 rounded-full text-white transition-all shadow-xl hover:scale-110 active:scale-95",
                audioError
                  ? "bg-gradient-to-br from-red-400 to-red-500 shadow-red-500/40"
                  : "bg-gradient-to-br from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 shadow-gold-500/40",
                isLoading && "opacity-70 cursor-wait",
              )}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isLoading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full text-graphite-500 hover:bg-gold-100 hover:text-graphite-700 transition-all hover:scale-110 active:scale-95"
              aria-label="下一首"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gold-200/40">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg text-graphite-500 hover:bg-gold-100 transition-colors"
              aria-label={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number.parseFloat(e.target.value))
                setIsMuted(false)
              }}
              className="flex-1 h-1.5 rounded-full appearance-none bg-gold-200/60 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:shadow-md"
              aria-label="音量"
            />
            <span className="text-xs text-graphite-400 w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* 同步按钮 */}
          <button
            onClick={() => syncPosition("wedding-2025")}
            className="w-full mt-4 py-2.5 rounded-xl bg-gold-50 hover:bg-gold-100 text-graphite-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Users className="h-4 w-4" />
            同步到其他设备
          </button>
        </div>

        {/* 播放列表 */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-graphite-600 flex items-center gap-2">
            <span>播放列表</span>
            <span className="text-xs text-graphite-400">({currentPlaylist.length} 首)</span>
            <span className="text-xs text-gold-500">| 全库共 20 首</span>
          </h5>
          <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-gold-300">
            {currentPlaylist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  fadeOut(() => {
                    setCurrentTrackIndex(index)
                    setProgress(0)
                    setTimeout(() => {
                      if (isPlaying) fadeIn(volume)
                    }, 100)
                  })
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all",
                  index === currentTrackIndex
                    ? "bg-gold-100 text-graphite-800 shadow-sm"
                    : "hover:bg-gold-50 text-graphite-600",
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    index === currentTrackIndex ? "bg-gold-500 text-white" : "bg-gold-100 text-graphite-500",
                  )}
                >
                  {index === currentTrackIndex && isPlaying ? "♪" : index + 1}
                </span>
                <span className="flex-1 text-sm truncate font-medium">{track.name}</span>
                <span className="text-xs text-graphite-400">{track.duration}</span>
                {votes[track.id] > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gold-600">
                    <ThumbsUp className="h-3 w-3" />
                    {votes[track.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DraggableModal>
  )
}
