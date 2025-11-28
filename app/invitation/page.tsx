'use client'

import { useState, useEffect } from 'react'
import {
  Phone,
  MessageSquare,
  MapPin,
  Heart,
  Calendar,
  Clock,
  ChevronDown,
  Play,
  X,
} from 'lucide-react'
import { weddingConfig } from '@/lib/wedding-config'
import { cn } from '@/lib/utils'

export default function InvitationPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // 主婚视频列表（包含新娘婚纱视频）
  const primaryVideos = [
    { url: '/MP4/wedding主婚1.mp4', poster: '/wedding/wedding-主婚合影.jpg', title: '主婚视频1' },
    { url: '/MP4/wedding主婚2.mp4', poster: '/wedding/wedding-主婚合影2.jpg', title: '主婚视频2' },
    { url: '/MP4/wedding主婚3.mp4', poster: '/wedding/Bride-主纱1.jpg', title: '新娘婚纱1' },
    { url: '/MP4/wedding主婚4.mp4', poster: '/wedding/Bride-主纱2.jpg', title: '新娘婚纱2' },
    { url: '/MP4/wedding主婚5.mp4', poster: '/wedding/Bride-主纱3.jpg', title: '新娘婚纱3' },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const { couple, date, lunarDate, venue, invitation } = weddingConfig

  const formattedDate = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const formattedTime = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // 一键电话
  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`
  }

  // 一键导航
  const handleNavigation = () => {
    // 优先使用苹果地图，如果不支持则使用高德地图
    if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
      window.location.href = venue.mapUrl
    } else {
      // Android 使用高德地图
      const amapUrl = `https://uri.amap.com/marker?position=${venue.coordinates.lng},${
        venue.coordinates.lat
      }&name=${encodeURIComponent(venue.name + venue.branch)}&coordinate=gaode&callnative=1`
      window.location.href = amapUrl
    }
  }

  // 留言功能（跳转到留言墙）
  const handleMessage = () => {
    setShowMessage(true)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
      </div>

      {/* 顶部装饰线条 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        {/* 标题装饰 */}
        <div
          className={cn(
            'text-center mb-8 transition-all duration-1000',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400" />
            <Heart className="h-6 w-6 text-rose-500 animate-pulse" fill="currentColor" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400" />
          </div>
          <h1 className="text-4xl font-serif text-rose-900 mb-2 tracking-wide">囍</h1>
          <p className="text-lg text-gray-700 tracking-wider">{invitation.title}</p>
        </div>

        {/* 主邀请卡片 */}
        <div
          className={cn(
            'bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-rose-100 transition-all duration-1000 delay-200',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* 新人名字 */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-3 tracking-wider">诚挚邀请您参加</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl font-light text-gray-800">{couple.groom}</span>
              <Heart className="h-5 w-5 text-rose-500 mx-2" fill="currentColor" />
              <span className="text-3xl font-light text-gray-800">{couple.bride}</span>
            </div>
            <p className="text-sm text-gray-400 tracking-wide">
              {couple.groomEnglish} & {couple.brideEnglish}
            </p>
            <div className="mt-4 pt-4 border-t border-rose-100">
              <p className="text-2xl font-serif text-rose-800 mb-1">婚礼庆典</p>
              <p className="text-sm text-gray-500">{invitation.message}</p>
            </div>
          </div>

          {/* 日期时间 */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-xl">
              <Calendar className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">婚礼日期</p>
                <p className="text-base font-medium text-gray-800">{formattedDate}</p>
                <p className="text-sm text-rose-600 mt-1">{lunarDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-xl">
              <Clock className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">婚礼时间</p>
                <p className="text-base font-medium text-gray-800">{formattedTime}</p>
                <p className="text-sm text-gray-500 mt-1">请提前15分钟到场</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-xl">
              <MapPin className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">婚礼地点</p>
                <p className="text-base font-medium text-gray-800">
                  {venue.name}
                  <span className="text-sm text-gray-600">（{venue.branch}）</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{venue.address}</p>
              </div>
            </div>
          </div>

          {/* 主婚视频预览 */}
          <div
            className="relative mb-6 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setShowVideo(true)}
          >
            <div className="aspect-[9/16] bg-gradient-to-br from-rose-100 to-rose-200">
              <img
                src="/wedding/wedding-主婚合影.jpg"
                alt="婚礼视频封面"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-rose-600" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">点击播放主婚视频</p>
              </div>
            </div>
          </div>

          {/* 洛阳婚礼习俗提示 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-amber-800 flex items-center gap-2">
              <span className="text-lg">🏮</span>
              <span>
                <strong>洛阳传统习俗：</strong>敬茶环节，新人将向双方父母敬上清茶，感恩养育之恩
              </span>
            </p>
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div
          className={cn(
            'grid grid-cols-3 gap-3 mb-8 transition-all duration-1000 delay-400',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* 拨打新郎电话 */}
          <button
            onClick={() => handleCall(couple.groomPhone, couple.groom)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-100"
          >
            <div className="bg-blue-500 rounded-full p-3">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5">联系新郎</p>
              <p className="text-xs font-medium text-gray-800">{couple.groom}</p>
            </div>
          </button>

          {/* 拨打新娘电话 */}
          <button
            onClick={() => handleCall(couple.bridePhone, couple.bride)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-rose-100"
          >
            <div className="bg-rose-500 rounded-full p-3">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5">联系新娘</p>
              <p className="text-xs font-medium text-gray-800">{couple.bride}</p>
            </div>
          </button>

          {/* 一键导航 */}
          <button
            onClick={handleNavigation}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-green-100"
          >
            <div className="bg-green-500 rounded-full p-3">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5">导航</p>
              <p className="text-xs font-medium text-gray-800">前往现场</p>
            </div>
          </button>
        </div>

        {/* 留言按钮 */}
        <div
          className={cn(
            'transition-all duration-1000 delay-600',
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <button
            onClick={handleMessage}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">留言祝福</span>
          </button>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 mb-2">期待您的光临</p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300" />
            <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300" />
          </div>
        </div>
      </div>

      {/* 视频弹窗 - 循环播放 */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="w-full max-w-lg relative">
            <video
              key={currentVideoIndex}
              className="w-full rounded-xl shadow-2xl"
              autoPlay
              playsInline
              loop
              muted={false}
              poster={primaryVideos[currentVideoIndex].poster}
              onEnded={() => {
                // 视频结束后自动播放下一个
                setCurrentVideoIndex((prev) => (prev + 1) % primaryVideos.length)
              }}
            >
              <source src={primaryVideos[currentVideoIndex].url} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>

            {/* 视频标题 */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white text-sm font-medium">
                {primaryVideos[currentVideoIndex].title}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {currentVideoIndex + 1} / {primaryVideos.length}
              </p>
            </div>

            {/* 左右切换按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentVideoIndex((prev) => (prev - 1 + primaryVideos.length) % primaryVideos.length)
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm"
            >
              <ChevronDown className="h-6 w-6 text-white rotate-90" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentVideoIndex((prev) => (prev + 1) % primaryVideos.length)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm"
            >
              <ChevronDown className="h-6 w-6 text-white -rotate-90" />
            </button>

            {/* 视频指示器 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
              {primaryVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentVideoIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 留言弹窗 */}
      {showMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-800">送上您的祝福</h3>
              <button
                onClick={() => setShowMessage(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <textarea
              placeholder="写下您的祝福语..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
            />
            <button
              onClick={() => {
                alert('感谢您的祝福！')
                setShowMessage(false)
              }}
              className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:shadow-lg transition-all"
            >
              发送祝福
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
