Thought for 2s项目结构分析完成现在我将为你创建一个功能完整的可拖拽弹窗组件，支持所有你要求的功能。

弹窗组件已创建v1---

## Props 参数表格

| 属性名 | 类型 | 默认值 | 说明
|-----|-----|-----|-----
| `open` | `boolean` | **必填** | 控制弹窗显示/隐藏
| `onClose` | `() => void` | **必填** | 关闭弹窗的回调函数
| `title` | `ReactNode` | `"弹窗标题"` | 弹窗标题内容
| `children` | `ReactNode` | **必填** | 弹窗主体内容
| `draggable` | `boolean` | `true` | 是否允许拖拽移动
| `closeOnEsc` | `boolean` | `true` | 是否允许按 Esc 键关闭
| `closeOnBackdrop` | `boolean` | `true` | 是否允许点击背景遮罩关闭
| `showCloseButton` | `boolean` | `true` | 是否显示右上角关闭按钮
| `width` | `string | number` | `480` | 弹窗宽度
| `maxWidth` | `string | number` | `"90vw"` | 弹窗最大宽度
| `className` | `string` | — | 弹窗容器自定义类名
| `contentClassName` | `string` | — | 内容区域自定义类名
| `initialPosition` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | 弹窗初始偏移位置
| `zIndex` | `number` | `50` | 弹窗层级


---

该组件使用 `useDraggable` 自定义 Hook 实现拖拽逻辑，通过监听 `mousedown/mousemove/mouseup` 事件计算位置偏移。弹窗支持无障碍属性（`role="dialog"`、`aria-modal`），并在打开时自动锁定背景滚动，关闭时恢复。所有功能均可通过 Props 灵活配置。

No issues found
