// 媒体选择工具：按关键词优先并去重
export type MediaItem = { src?: string; url?: string; poster?: string; title?: string }

const DEFAULT_KEYWORDS = ['主婚', '主纱', '主婚单', '主婚合影']

export function prioritizeMedia(items: MediaItem[], count = 1, keywords: string[] = DEFAULT_KEYWORDS) {
  if (!Array.isArray(items) || items.length === 0) return []

  // 按关键词优先匹配
  const lowerKeys = keywords.map(k => k.toLowerCase())

  const hasKeyword = (it: MediaItem) => {
    const key = (it.src ?? it.url ?? '').toLowerCase()
    return lowerKeys.some(k => key.includes(k))
  }

  const prioritized = items.filter(hasKeyword)
  const others = items.filter(it => !hasKeyword(it))

  const ordered = [...prioritized, ...others]

  // 去重（根据 src 或 url）并截取指定数量
  const seen = new Set<string>()
  const result: MediaItem[] = []

  for (const it of ordered) {
    const key = (it.src ?? it.url ?? '').trim()
    if (!key) continue
    if (seen.has(key)) continue
    seen.add(key)
    result.push(it)
    if (result.length >= count) break
  }

  return result
}
