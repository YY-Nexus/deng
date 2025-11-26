/**
 * 任务卡 09: 设计系统与 UI Tokens
 * 完整的设计令牌定义，支持暗色/高对比模式
 */

export const designTokens = {
  // 颜色系统
  colors: {
    // 主色：暖金
    gold: {
      50: "#fefdf8",
      100: "#fdf9e8",
      200: "#fbf0c4",
      300: "#f7e296",
      400: "#f2ce5c",
      500: "#d4a847",
      600: "#b8923d",
      700: "#8c6d2f",
      800: "#5f4a20",
      900: "#3d3015",
    },
    // 中性色：石墨灰
    graphite: {
      50: "#f8f8f7",
      100: "#e8e8e6",
      200: "#d1d1cd",
      300: "#a8a8a3",
      400: "#7a7a74",
      500: "#5c5c56",
      600: "#4a4a45",
      700: "#3d3d39",
      800: "#2d2d2a",
      900: "#1a1a18",
    },
    // 功能色
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // 间距系统 (rem)
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  // 字体系统
  typography: {
    fontFamily: {
      sans: '"Geist", "Geist Fallback", system-ui, sans-serif',
      mono: '"Geist Mono", "Geist Mono Fallback", monospace',
      serif: '"Noto Serif SC", "Songti SC", serif',
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1.16" }],
      "6xl": ["3.75rem", { lineHeight: "1.1" }],
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // 阴影系统
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    gold: "0 4px 14px 0 rgba(212, 168, 71, 0.25)",
    "gold-lg": "0 10px 25px -3px rgba(212, 168, 71, 0.3)",
    glow: "0 0 20px rgba(212, 168, 71, 0.4)",
  },

  // 圆角
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    DEFAULT: "0.5rem",
    md: "0.625rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  // 动画
  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    DEFAULT: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  // 层级
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    toast: 80,
  },

  // 断点
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const

// 高对比模式令牌覆盖
export const highContrastTokens = {
  colors: {
    gold: {
      ...designTokens.colors.gold,
      500: "#c49530", // 更深的金色
      600: "#9a7528",
    },
    graphite: {
      ...designTokens.colors.graphite,
      900: "#000000", // 纯黑
    },
  },
  // 增强边框对比度
  border: {
    width: "2px",
    color: "#000000",
  },
}

// 导出 CSS 变量
export function tokensToCSSVariables(tokens = designTokens): string {
  const lines: string[] = []

  // 颜色
  Object.entries(tokens.colors.gold).forEach(([key, value]) => {
    lines.push(`--color-gold-${key}: ${value};`)
  })
  Object.entries(tokens.colors.graphite).forEach(([key, value]) => {
    lines.push(`--color-graphite-${key}: ${value};`)
  })

  // 间距
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`--spacing-${key}: ${value};`)
  })

  // 阴影
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    const name = key === "DEFAULT" ? "shadow" : `shadow-${key}`
    lines.push(`--${name}: ${value};`)
  })

  // 圆角
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    const name = key === "DEFAULT" ? "radius" : `radius-${key}`
    lines.push(`--${name}: ${value};`)
  })

  return `:root {\n  ${lines.join("\n  ")}\n}`
}

export type DesignTokens = typeof designTokens
