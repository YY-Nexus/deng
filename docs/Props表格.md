Thought for 4s我先读取现有的弹窗和音乐播放器组件，然后进行全面升级：

弹窗组件已读取音乐播放器已读取拖拽Hook已读取现在我来升级这两个组件，添加完整的功能：

组件升级完成v10---

## 一、可拖拽弹窗组件 Props 表格

| 属性名 | 类型 | 默认值 | 说明
|-----|-----|-----|-----
| `open` | `boolean` | **必填** | 控制弹窗显示/隐藏
| `onClose` | `() => void` | **必填** | 关闭弹窗回调函数
| `title` | `ReactNode` | `"弹窗"` | 弹窗标题内容
| `children` | `ReactNode` | **必填** | 弹窗主体内容
| `draggable` | `boolean` | `true` | 是否允许拖拽移动
| `closeOnEsc` | `boolean` | `true` | 按 Esc 键关闭
| `closeOnBackdrop` | `boolean` | `true` | 点击背景遮罩关闭
| `showCloseButton` | `boolean` | `true` | 显示关闭按钮
| `showMinMax` | `boolean` | `false` | 显示最小化/最大化按钮
| `width` | `string | number` | `480` | 弹窗宽度
| `height` | `string | number` | — | 弹窗高度
| `minWidth` | `string | number` | `280` | 最小宽度
| `minHeight` | `string | number` | `200` | 最小高度
| `maxWidth` | `string | number` | `"90vw"` | 最大宽度
| `maxHeight` | `string | number` | `"85vh"` | 最大高度
| `variant` | `"default" | "glass" | "glass-dark"` | `"glass"` | 视觉变体
| `blur` | `"none" | "sm" | "md" | "lg" | "xl"` | `"lg"` | 背景模糊程度
| `opacity` | `number` | `0.88` | 弹窗背景透明度
| `overlayOpacity` | `number` | `0.3` | 遮罩层透明度
| `ariaLabel` | `string` | — | 无障碍标签
| `boundaryConstraint` | `boolean` | `true` | 启用边界约束
| `reduceMotion` | `boolean` | `false` | 降级动画模式
| `onStateChange` | `(state) => void` | — | 状态变化回调


---

## 二、音乐播放器接口签名 + 状态机

```typescript
// API 接口签名
type GetPlaylistFn = (category: MusicCategory) => Promise<Track[]>

type VoteTrackFn = (trackId: string, guestId: string) => Promise<{
  success: boolean
  trackId: string
  voteCount: number
  message?: string
}>

type SyncPositionFn = (sessionId: string) => Promise<SyncState>
```

### 状态机简图（Markdown）

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                      播放器状态机                            │
├─────────────────────────────────────────────────────────────┤
│  [IDLE] ──PLAY──> [PLAYING] ──PAUSE──> [PAUSED]            │
│    │                  │                    │                │
│    │                  ├──NEXT/PREV────────>│                │
│    │                  ├──SEEK──────────────│                │
│    └──LOAD_TRACK─────>└──FADE_OUT──>[TRANSITIONING]        │
├─────────────────────────────────────────────────────────────┤
│                      投票状态机                              │
├─────────────────────────────────────────────────────────────┤
│  [READY] ──VOTE_START──> [VOTING] ──SUCCESS──> [VOTED]     │
│                              └──ERROR──> [READY]            │
├─────────────────────────────────────────────────────────────┤
│                      同步状态机                              │
├─────────────────────────────────────────────────────────────┤
│  [DISCONNECTED] ──CONNECT──> [CONNECTED] ──UPDATE──> [SYNCED]│
│        │                          │                          │
│        └──────BECOME_HOST────────>└──DISCONNECT──>[DISCONNECTED]│
└─────────────────────────────────────────────────────────────┘
```

---

完成了两个核心组件的升级：**AdvancedModal** 新增了最小化/最大化、边界约束、键盘焦点捕获、动画降级策略和分阶段阴影动画；**MusicPlayer** 实现了淡入淡出过渡、音量记忆（localStorage）、`voteTrack` 和 `syncPosition` API 接口，以及完整的状态机逻辑。

No issues found
