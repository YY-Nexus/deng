// ==================== 音乐播放器类型定义 ====================

export type MusicCategory = "entrance" | "tea" | "dinner" | "farewell"

export interface Track {
  id: string
  name: string
  artist: string
  duration: string
  durationSeconds: number
  url?: string
  coverUrl?: string
}

export interface PlaylistState {
  category: MusicCategory
  tracks: Track[]
  currentIndex: number
}

export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  error: string | null
}

export interface VoteRecord {
  trackId: string
  guestId: string
  timestamp: number
}

export interface SyncState {
  sessionId: string
  position: number
  trackId: string
  timestamp: number
  isHost: boolean
}

// ==================== API 接口签名 ====================

/**
 * 获取分段播放列表
 * @param category 分段类型：进场/敬茶/用餐/送客
 * @returns 该分段的曲目列表
 */
export type GetPlaylistFn = (category: MusicCategory) => Promise<Track[]>

/**
 * 来宾投票
 * @param trackId 曲目ID
 * @param guestId 来宾ID
 * @returns 投票结果（更新后的票数）
 */
export type VoteTrackFn = (
  trackId: string,
  guestId: string,
) => Promise<{
  success: boolean
  trackId: string
  voteCount: number
  message?: string
}>

/**
 * 跨设备同步播放位置
 * @param sessionId 会话ID（用于同一婚礼的所有设备）
 * @returns 同步状态
 */
export type SyncPositionFn = (sessionId: string) => Promise<SyncState>

/**
 * 更新同步状态（主设备调用）
 * @param sessionId 会话ID
 * @param position 当前播放位置（秒）
 * @param trackId 当前曲目ID
 */
export type UpdateSyncPositionFn = (sessionId: string, position: number, trackId: string) => Promise<void>

// ==================== 状态机类型 ====================

export type PlayerAction =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK"; position: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "CHANGE_CATEGORY"; category: MusicCategory }
  | { type: "LOAD_TRACK"; track: Track }
  | { type: "SYNC_POSITION"; state: SyncState }
  | { type: "ERROR"; error: string }

export type VoteAction =
  | { type: "VOTE_START"; trackId: string }
  | { type: "VOTE_SUCCESS"; trackId: string; voteCount: number }
  | { type: "VOTE_ERROR"; error: string }

export type SyncAction =
  | { type: "SYNC_START" }
  | { type: "SYNC_CONNECTED"; sessionId: string }
  | { type: "SYNC_UPDATE"; state: SyncState }
  | { type: "SYNC_DISCONNECT" }
  | { type: "BECOME_HOST" }
