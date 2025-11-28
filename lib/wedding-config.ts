// 婚礼配置文件 - 张波 & 邓芮婚礼

export const weddingConfig = {
  // 新人信息
  couple: {
    groom: "张波",
    bride: "邓芮",
    groomEnglish: "Zhang Bo",
    brideEnglish: "Deng Rui",
    groomPhone: "18736396660",
    bridePhone: "19103895555",
  },

  // 婚礼日期 - 2025年11月29日 星期六 农历十月初十 上午11:30
  date: new Date("2025-11-29T11:30:00"),
  lunarDate: "农历十月初十",

  // 婚礼地点 - 富豪大酒店
  venue: {
    name: "富豪大酒店",
    branch: "阿新大道店",
    address: "河南省洛阳市孟津区将军路57号",
    city: "洛阳",
    district: "孟津区",
    mapUrl:
      "https://maps.apple.com/place?address=%E4%B8%AD%E5%9B%BD%E6%B2%B3%E5%8D%97%E7%9C%81%E6%B4%9B%E9%98%B3%E5%B8%82%E5%AD%9F%E6%B4%A5%E5%8C%BA%E9%BA%BB%E5%B1%AF%E9%95%87%E5%9C%9F%E5%9C%B0%E6%89%80%E5%AF%B9%E9%9D%A2&coordinate=34.734682,112.367732&name=%E5%AF%8C%E8%B1%AA%E5%A4%A7%E9%85%92%E5%BA%97(%E9%98%BF%E6%96%B0%E5%A4%A7%E9%81%93%E5%BA%97)&map=explore",
    coordinates: {
      lat: 34.734682,
      lng: 112.367732,
    },
  },

  // 日程安排 - 洛阳婚礼习俗
  schedule: [
    { time: "10:30", event: "宾客签到", icon: "pen", description: "签到领取喜糖喜帖" },
    { time: "11:00", event: "迎宾入场", icon: "door", description: "新人迎接宾客入席" },
    { time: "11:30", event: "婚礼仪式", icon: "heart", description: "证婚、交换戒指、宣誓" },
    { time: "12:00", event: "喜宴开席", icon: "utensils", description: "共享喜宴佳肴" },
    { time: "13:00", event: "敬茶仪式", icon: "tea", description: "敬茶改口、长辈赐福" },
    { time: "14:00", event: "送客合影", icon: "camera", description: "感谢来宾、合影留念" },
  ],

  // 照片库 - 按实际文件结构分类
  photos: {
    groom: [
      { src: "/wedding/groom/groom-solo-10.jpg", alt: "新郎张波" },
      { src: "/wedding/groom/groom-solo-5.jpg", alt: "新郎风采" },
      { src: "/wedding/groom/groom-solo-7.jpg", alt: "帅气新郎" },
      { src: "/wedding/groom/groom-solo-8.jpg", alt: "新郎英姿" },
      { src: "/wedding/groom/groom-solo-9.jpg", alt: "幸福新郎" },
    ],
    bride: [
      { src: "/wedding/bride/bride-solo-5.jpg", alt: "新娘邓芮" },
      { src: "/wedding/bride/bride-solo-6.jpg", alt: "美丽新娘" },
      { src: "/wedding/bride/bride-solo-7.jpg", alt: "温柔新娘" },
    ],
    son: [
      { src: "/wedding/son/son-photo-10.jpg", alt: "宝贝" },
      { src: "/wedding/son/son-photo-11.jpg", alt: "可爱宝贝" },
      { src: "/wedding/son/son-photo-5.jpg", alt: "小天使" },
      { src: "/wedding/son/son-photo-6.jpg", alt: "幸福宝贝" },
    ],
    document: [{ src: "/wedding/document/wedding-document.jpg", alt: "结婚证照" }],
  },

  // 视频列表（主婚优先）
  videos: [
    { url: '/MP4/wedding主婚1.mp4', poster: '/wedding/wedding-主婚合影.jpg', title: '主婚视频1' },
    { url: '/MP4/wedding主婚2.mp4', poster: '/wedding/wedding-主婚合影2.jpg', title: '主婚视频2' },
    { url: '/MP4/wedding主婚3.mp4', poster: '/wedding/Bride-主纱1.jpg', title: '新娘婚纱1' },
    { url: '/MP4/wedding主婚4.mp4', poster: '/wedding/Bride-主纱2.jpg', title: '新娘婚纱2' },
    { url: '/MP4/wedding主婚5.mp4', poster: '/wedding/Bride-主纱3.jpg', title: '新娘婚纱3' },
  ],

  // 画廊展示 - 整合所有照片用于3D画廊
  gallery: [
    {
      id: 1,
      src: "/wedding/document/wedding-document.jpg",
      title: "我们的证书",
      description: "爱的见证，幸福的起点",
      category: "document",
    },
    {
      id: 2,
      src: "/wedding/groom/groom-solo-10.jpg",
      title: "帅气新郎",
      description: "张波的风采",
      category: "groom",
    },
    {
      id: 3,
      src: "/wedding/bride/bride-solo-5.jpg",
      title: "美丽新娘",
      description: "邓芮的温柔",
      category: "bride",
    },
    {
      id: 4,
      src: "/wedding/son/son-photo-10.jpg",
      title: "爱的结晶",
      description: "我们的小宝贝",
      category: "family",
    },
    // 添加更多照片用于3D画廊展示
    {
      id: 5,
      src: "/wedding/groom/groom-solo-5.jpg",
      title: "新郎英姿",
      description: "幸福时刻",
      category: "groom",
    },
    {
      id: 6,
      src: "/wedding/bride/bride-solo-6.jpg",
      title: "新娘风采",
      description: "美丽动人",
      category: "bride",
    },
    {
      id: 7,
      src: "/wedding/son/son-photo-5.jpg",
      title: "可爱宝贝",
      description: "家的温暖",
      category: "family",
    },
  ],

  // 音乐曲库 - 中文婚礼分段播放
  musicLibrary: {
    entrance: [
      {
        id: "entrance-1",
        name: "今天你要嫁给我",
        artist: "陶喆 & 蔡依林",
        duration: "4:32",
        url: "/audio/entrance-1.mp3",
      },
      { id: "entrance-2", name: "最浪漫的事", artist: "赵咏华", duration: "4:18", url: "/audio/entrance-2.mp3" },
      { id: "entrance-3", name: "爱你一万年", artist: "刘德华", duration: "4:05", url: "/audio/entrance-3.mp3" },
      { id: "entrance-4", name: "幸福的脸", artist: "刘若英", duration: "4:22", url: "/audio/entrance-4.mp3" },
      { id: "entrance-5", name: "婚礼进行曲", artist: "门德尔松", duration: "4:50", url: "/audio/entrance-5.mp3" },
    ],
    tea: [
      { id: "tea-1", name: "甜蜜蜜", artist: "邓丽君", duration: "3:26", url: "/audio/tea-1.mp3" },
      { id: "tea-2", name: "月亮代表我的心", artist: "邓丽君", duration: "3:45", url: "/audio/tea-2.mp3" },
      { id: "tea-3", name: "家和万事兴", artist: "群星", duration: "4:12", url: "/audio/tea-3.mp3" },
      { id: "tea-4", name: "常回家看看", artist: "陈红", duration: "4:08", url: "/audio/tea-4.mp3" },
      { id: "tea-5", name: "父亲", artist: "筷子兄弟", duration: "5:15", url: "/audio/tea-5.mp3" },
    ],
    dinner: [
      { id: "dinner-1", name: "爱很简单", artist: "陶喆", duration: "5:12", url: "/audio/dinner-1.mp3" },
      { id: "dinner-2", name: "小幸运", artist: "田馥甄", duration: "4:35", url: "/audio/dinner-2.mp3" },
      { id: "dinner-3", name: "给你们", artist: "张宇", duration: "4:28", url: "/audio/dinner-3.mp3" },
      { id: "dinner-4", name: "好日子", artist: "宋祖英", duration: "3:56", url: "/audio/dinner-4.mp3" },
      { id: "dinner-5", name: "恭喜发财", artist: "刘德华", duration: "3:42", url: "/audio/dinner-5.mp3" },
      { id: "dinner-6", name: "欢乐中国年", artist: "群星", duration: "4:00", url: "/audio/dinner-6.mp3" },
    ],
    farewell: [
      { id: "farewell-1", name: "有你真好", artist: "周华健", duration: "4:20", url: "/audio/farewell-1.mp3" },
      { id: "farewell-2", name: "朋友", artist: "周华健", duration: "5:01", url: "/audio/farewell-2.mp3" },
      { id: "farewell-3", name: "难忘今宵", artist: "李谷一", duration: "4:15", url: "/audio/farewell-3.mp3" },
      { id: "farewell-4", name: "祝福", artist: "张学友", duration: "4:38", url: "/audio/farewell-4.mp3" },
    ],
  },

  // 洛阳婚礼习俗提示
  traditions: [
    { title: "六礼传统", description: "纳采、问名、纳吉、纳征、请期、亲迎，延续千年礼仪" },
    { title: "迎亲习俗", description: "新郎携花轿迎娶新娘，一路鞭炮喜庆" },
    { title: "拜堂仪式", description: "一拜天地、二拜高堂、夫妻对拜，礼成合卺" },
    { title: "敬茶改口", description: "新人向双方父母敬茶，改口称呼，长辈赐福" },
    { title: "洛阳喜宴", description: "传统八大碗、洛阳水席，宾客尽欢" },
  ],

  // 邀请文案
  invitation: {
    title: "诚挚邀请",
    message: "诚挚邀请您和您的家人参加我们的婚礼，分享我们的幸福和喜悦！",
    subtitle: "张波 & 邓芮 诚邀",
  },
}

// 倒计时计算
export function getCountdown(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isOver: false }
}

// 格式化电话号码用于拨号
export function formatPhoneForCall(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`
}

// 获取高德地图导航链接
export function getAMapNavUrl(lat: number, lng: number, name: string) {
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&coordinate=gaode&callnative=1`
}
