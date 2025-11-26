/**
 * 任务卡 08: 动效系统与动效库
 * 定义全站动效规范：流体过渡、光晕、微振动、按钮反馈
 * 提供 GSAP 风格的动画配置与 CSS 降级策略
 */

// 动画缓动曲线
export const easings = {
  // 标准缓动
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  // 弹性缓动
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // 快速进入
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  // 快速退出
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // 流体感
  fluid: "cubic-bezier(0.22, 1, 0.36, 1)",
  // 弹簧效果
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const

// 动画时长配置（毫秒）
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
} as const

// 动画配置预设
export const animations = {
  // 弹窗动画
  modal: {
    enter: {
      scale: { from: 0.95, to: 1 },
      opacity: { from: 0, to: 1 },
      blur: { from: 8, to: 0 },
      duration: durations.normal,
      easing: easings.spring,
    },
    exit: {
      scale: { from: 1, to: 0.95 },
      opacity: { from: 1, to: 0 },
      blur: { from: 0, to: 8 },
      duration: durations.fast,
      easing: easings.easeIn,
    },
  },

  // 按钮反馈
  button: {
    hover: {
      scale: 1.02,
      duration: durations.fast,
      easing: easings.easeOut,
    },
    tap: {
      scale: 0.98,
      duration: durations.instant,
      easing: easings.easeOut,
    },
    ripple: {
      duration: durations.slow,
      easing: easings.easeOut,
    },
  },

  // 画廊切换
  gallery: {
    slide: {
      duration: durations.normal,
      easing: easings.fluid,
    },
    zoom: {
      duration: durations.slow,
      easing: easings.spring,
    },
  },

  // AI 面板弹出
  aiPanel: {
    enter: {
      x: { from: -20, to: 0 },
      opacity: { from: 0, to: 1 },
      duration: durations.normal,
      easing: easings.spring,
    },
    exit: {
      x: { from: 0, to: -20 },
      opacity: { from: 1, to: 0 },
      duration: durations.fast,
      easing: easings.easeIn,
    },
  },

  // 滚动揭示
  scrollReveal: {
    fadeUp: {
      y: { from: 30, to: 0 },
      opacity: { from: 0, to: 1 },
      duration: durations.slow,
      easing: easings.fluid,
    },
    fadeIn: {
      opacity: { from: 0, to: 1 },
      duration: durations.normal,
      easing: easings.easeOut,
    },
    scaleUp: {
      scale: { from: 0.9, to: 1 },
      opacity: { from: 0, to: 1 },
      duration: durations.normal,
      easing: easings.spring,
    },
  },

  // 光晕效果
  glow: {
    pulse: {
      boxShadow: [
        "0 0 20px rgba(212, 168, 71, 0.3)",
        "0 0 40px rgba(212, 168, 71, 0.6)",
        "0 0 20px rgba(212, 168, 71, 0.3)",
      ],
      duration: 2000,
    },
  },
} as const

// 降级策略检测
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// 获取降级后的动画配置
export function getAnimationConfig<T extends keyof typeof animations>(
  type: T,
  variant: keyof (typeof animations)[T],
): (typeof animations)[T][typeof variant] | null {
  if (shouldReduceMotion()) {
    return null // 返回 null 表示禁用动画
  }
  return animations[type][variant] as (typeof animations)[T][typeof variant]
}

// CSS 变量生成器
export function generateCSSVariables(): string {
  return `
    :root {
      --animation-easing-default: ${easings.default};
      --animation-easing-bounce: ${easings.bounce};
      --animation-easing-fluid: ${easings.fluid};
      --animation-easing-spring: ${easings.spring};
      
      --animation-duration-instant: ${durations.instant}ms;
      --animation-duration-fast: ${durations.fast}ms;
      --animation-duration-normal: ${durations.normal}ms;
      --animation-duration-slow: ${durations.slow}ms;
    }
    
    @media (prefers-reduced-motion: reduce) {
      :root {
        --animation-duration-instant: 0ms;
        --animation-duration-fast: 0ms;
        --animation-duration-normal: 0ms;
        --animation-duration-slow: 0ms;
      }
    }
  `
}
