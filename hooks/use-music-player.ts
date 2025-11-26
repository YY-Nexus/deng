"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import type {
  MusicCategory,
  Track,
  PlayerState,
  SyncState,
  GetPlaylistFn,
  VoteTrackFn,
  SyncPositionFn,
} from "@/lib/music-player-types"

// ==================== 音量记忆 Hook ====================

function useVolumeMemory(key = "wedding-music-volume") {
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

// ==================== 淡入淡出 Hook ====================

function useFadeTransition(audioRef: React.RefObject<HTMLAudioElement | null>, duration = 1000) {
  const fadeInterval = useRef<NodeJS.Timeout | null>(null)

  const fadeIn = useCallback(
    (targetVolume: number) => {
      if (!audioRef.current) return
      const audio = audioRef.current
      audio.volume = 0
      audio.play()

      const steps = 20
      const stepTime = duration / steps
      const volumeStep = targetVolume / steps
      let currentStep = 0

      fadeInterval.current = setInterval(() => {
        currentStep++
        audio.volume = Math.min(volumeStep * currentStep, targetVolume)
        if (currentStep >= steps) {
          if (fadeInterval.current) clearInterval(fadeInterval.current)
        }
      }, stepTime)
    },
    [audioRef, duration],
  )

  const fadeOut = useCallback(
    (callback?: () => void) => {
      if (!audioRef.current) return
      const audio = audioRef.current
      const startVolume = audio.volume

      const steps = 20
      const stepTime = duration / steps
      const volumeStep = startVolume / steps
      let currentStep = 0

      fadeInterval.current = setInterval(() => {
        currentStep++
        audio.volume = Math.max(startVolume - volumeStep * currentStep, 0)
        if (currentStep >= steps) {
          if (fadeInterval.current) clearInterval(fadeInterval.current)
          audio.pause()
          callback?.()
        }
      }, stepTime)
    },
    [audioRef, duration],
  )

  useEffect(() => {
    return () => {
      if (fadeInterval.current) clearInterval(fadeInterval.current)
    }
  }, [])

  return { fadeIn, fadeOut }
}

// ==================== 主 Hook ====================

interface UseMusicPlayerOptions {
  playlists: Record<MusicCategory, Track[]>
  enableSync?: boolean
  sessionId?: string
}

export function useMusicPlayer(options: UseMusicPlayerOptions) {
  const { playlists, enableSync = false, sessionId } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { volume, setVolume } = useVolumeMemory()
  const { fadeIn, fadeOut } = useFadeTransition(audioRef)

  const [category, setCategory] = useState<MusicCategory>("entrance")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume,
    isMuted: false,
    isLoading: false,
    error: null,
  })
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [syncState, setSyncState] = useState<SyncState | null>(null)

  const currentPlaylist = playlists[category]
  const currentTrack = currentPlaylist?.[currentIndex]

  // 播放控制
  const play = useCallback(() => {
    if (playerState.isMuted) {
      audioRef.current?.play()
    } else {
      fadeIn(volume)
    }
    setPlayerState((s) => ({ ...s, isPlaying: true }))
  }, [fadeIn, volume, playerState.isMuted])

  const pause = useCallback(() => {
    fadeOut(() => setPlayerState((s) => ({ ...s, isPlaying: false })))
  }, [fadeOut])

  const togglePlay = useCallback(() => {
    playerState.isPlaying ? pause() : play()
  }, [playerState.isPlaying, play, pause])

  const next = useCallback(() => {
    fadeOut(() => {
      setCurrentIndex((i) => (i + 1) % currentPlaylist.length)
      setTimeout(() => fadeIn(volume), 100)
    })
  }, [fadeOut, fadeIn, currentPlaylist?.length, volume])

  const prev = useCallback(() => {
    fadeOut(() => {
      setCurrentIndex((i) => (i - 1 + currentPlaylist.length) % currentPlaylist.length)
      setTimeout(() => fadeIn(volume), 100)
    })
  }, [fadeOut, fadeIn, currentPlaylist?.length, volume])

  const seek = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position
    }
  }, [])

  const changeCategory = useCallback(
    (newCategory: MusicCategory) => {
      fadeOut(() => {
        setCategory(newCategory)
        setCurrentIndex(0)
        setTimeout(() => fadeIn(volume), 100)
      })
    },
    [fadeOut, fadeIn, volume],
  )

  const toggleMute = useCallback(() => {
    setPlayerState((s) => {
      if (audioRef.current) {
        audioRef.current.muted = !s.isMuted
      }
      return { ...s, isMuted: !s.isMuted }
    })
  }, [])

  const updateVolume = useCallback(
    (v: number) => {
      setVolume(v)
      if (audioRef.current) {
        audioRef.current.volume = v
      }
      setPlayerState((s) => ({ ...s, volume: v }))
    },
    [setVolume],
  )

  // ==================== API 实现 ====================

  const getPlaylist: GetPlaylistFn = useCallback(
    async (cat) => {
      return playlists[cat] || []
    },
    [playlists],
  )

  const voteTrack: VoteTrackFn = useCallback(
    async (trackId, guestId) => {
      // 模拟 API 调用
      const voteKey = `${trackId}-${guestId}`
      const hasVoted = localStorage.getItem(voteKey)

      if (hasVoted) {
        return { success: false, trackId, voteCount: votes[trackId] || 0, message: "您已经投过票了" }
      }

      localStorage.setItem(voteKey, "true")
      const newCount = (votes[trackId] || 0) + 1
      setVotes((v) => ({ ...v, [trackId]: newCount }))

      return { success: true, trackId, voteCount: newCount }
    },
    [votes],
  )

  const syncPosition: SyncPositionFn = useCallback(
    async (sid) => {
      // 模拟同步 - 实际应连接 WebSocket
      const state: SyncState = {
        sessionId: sid,
        position: audioRef.current?.currentTime || 0,
        trackId: currentTrack?.id || "",
        timestamp: Date.now(),
        isHost: true,
      }
      setSyncState(state)
      return state
    },
    [currentTrack],
  )

  // 时间更新监听
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      setPlayerState((s) => ({ ...s, currentTime: audio.currentTime }))
    }

    const onLoadedMetadata = () => {
      setPlayerState((s) => ({ ...s, duration: audio.duration, isLoading: false }))
    }

    const onEnded = () => next()

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [next])

  return {
    // Refs
    audioRef,
    // State
    category,
    currentIndex,
    currentTrack,
    currentPlaylist,
    playerState,
    votes,
    syncState,
    // Actions
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    changeCategory,
    toggleMute,
    updateVolume,
    // API
    getPlaylist,
    voteTrack,
    syncPosition,
  }
}
