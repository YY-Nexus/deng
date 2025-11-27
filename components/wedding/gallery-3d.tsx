"use client"

import * as React from "react"
import { useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"
import { Environment, Text, Html, OrbitControls, PerspectiveCamera, Float, useIntersect } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"
import { weddingConfig } from "@/lib/wedding-config"
import { DraggableModal } from "@/components/draggable-modal"
// ErrorBoundary组件暂时不使用，避免导入错误
import { Heart, Music, MessageSquare } from "lucide-react"

// 声明JSX命名空间以解决IntrinsicElements问题
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML元素
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
      // 3D元素
      boxGeometry: any
      planeGeometry: any
      torusGeometry: any
      bufferGeometry: any
      bufferAttribute: any
      pointsMaterial: any
      mesh: any
      meshStandardMaterial: any
      pointLight: any
      ambientLight: any
      hemisphereLight: any
      directionalLight: any
      Float: any
      Html: any
      Canvas: any
      Points: any
      orthographicCamera: any
    }
  }
}

// 纹理加载组件
  function LazyTexture({ src, color }: { src: string; color: string }) {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const texture = useTexture(src, () => {
      setIsLoaded(true)
    })

    // 使用Suspense处理延迟加载
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 1000) // 1秒超时

      return () => clearTimeout(timer)
    }, [])

    return (
      <meshStandardMaterial
        map={texture}
        color={color}
        transparent
        opacity={isLoaded ? 1 : 0}
        metalness={0.1}
        roughness={0.8}
      />
    )
  }

// 画框组件
  function PhotoFrame({
    position,
    rotation,
    photo,
    onClick,
    index,
  }: {
    position: [number, number, number]
    rotation: [number, number, number]
    photo: (typeof weddingConfig.gallery)[0]
    onClick: () => void
    index: number
  }) {
    const meshRef = React.useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = React.useState(false)
    const [clicked, setClicked] = React.useState(false)
    const [isVisible, setIsVisible] = React.useState(false)
    const [opacity, setOpacity] = React.useState(0)
    const [scale, setScale] = React.useState(0.8)
    const intersect = useIntersect(meshRef) // 返回单个值而不是数组
    
    // 类型安全的事件处理器
      const handleMouseOver = () => {
        setHovered(true)
      }
      
      const handleMouseOut = () => {
        setHovered(false)
      }
      
      const handleClick = () => {
        setClicked(true)
        onClick()
        setTimeout(() => setClicked(false), 300)
      }

  // 检测可见性，用于优化渲染和入场动画
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    
    if (intersect && intersect.state === 'visible') {
      setIsVisible(true)
      // 入场动画
      setOpacity(0)
      setScale(0.8)
      timer = setTimeout(() => {
        setOpacity(1)
        setScale(1)
      }, index * 100) // 错开入场时间
    } else {
      setIsVisible(false)
      // 重置状态
      setOpacity(0)
      setScale(0.8)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [intersect, index])

  const [showParticles, setShowParticles] = React.useState(false)

  // 点击反馈动画

  useFrame((state) => {
    if (meshRef.current) {
      // 入场动画过渡 - 只修改缩放，透明度通过CSS或材质属性处理
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (scale - meshRef.current.scale.x) * 0.1
      )
      
      // 悬停缩放动画
      const targetScale = hovered ? 1.08 : 1
      const currentScale = meshRef.current.scale.x
      meshRef.current.scale.setScalar(
        currentScale + (targetScale - currentScale) * 0.1
      )
      
      // 点击反馈动画
      if (clicked) {
        meshRef.current.scale.setScalar(
          currentScale + (0.95 - currentScale) * 0.2
        )
      }
      
      // 轻微旋转效果
      if (hovered) {
        meshRef.current.rotation.y += 0.01 * Math.sin(state.clock.elapsedTime * 2)
      }
    }
  })

  // 根据索引生成不同的渐变色
  const gradientColors = [
    ["#d4a847", "#f7e296"],
    ["#b8923d", "#fbf0c4"],
    ["#8c6d2f", "#f2ce5c"],
    ["#5f4a20", "#d4a847"],
    ["#d4a847", "#b8923d"],
    ["#f7e296", "#8c6d2f"],
  ]
  const colorPair = gradientColors[index % gradientColors.length]

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
        {/* 画框边框 */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handleMouseOver}
          onPointerOut={handleMouseOut}
          aria-label={`照片 ${photo.title} - 点击查看详情`}
          >
          <boxGeometry args={[2.4, 1.8, 0.15] as [number, number, number]} attach="geometry" />
          <meshStandardMaterial color={hovered ? "#d4a847" : "#5f4a20"} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* 画布内容 */}
        <mesh position={[0, 0, 0.08] as [number, number, number]}>
          <planeGeometry args={[2.1, 1.5] as [number, number]} attach="geometry" />
          <meshStandardMaterial color={colorPair[0]} metalness={0.1} roughness={0.8} />
        </mesh>

        {/* 实际照片 - 延迟加载纹理 */}
          <mesh position={[0, 0, 0.09] as [number, number, number]}>
          <planeGeometry args={[2, 1.4] as [number, number]} attach="geometry" />
          {isVisible ? (
            <LazyTexture src={photo.src} color={colorPair[1]} />
          ) : (
            <meshStandardMaterial
              transparent
              opacity={0.7}
              color={colorPair[1]}
              metalness={0.1}
              roughness={0.9}
            />
          )}
        </mesh>

        {/* 照片编号 */}
        <Text
          position={[0, 0, 0.1] as [number, number, number]}
          fontSize={0.5}
          color={colorPair[1]}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter_Regular.json"
        >
          {photo.id}
        </Text>

        {/* 标题标签 */}
        {hovered && (
          <Html position={[0, -1.2, 0] as [number, number, number]} center distanceFactor={10}>
            <div className="px-4 py-2 rounded-lg bg-graphite-900/90 backdrop-blur-sm border border-gold-500/30 whitespace-nowrap">
              <p className="text-gold-100 text-sm font-medium">{photo.title}</p>
              <p className="text-gold-400/70 text-xs">{photo.description}</p>
            </div>
          </Html>
        )}

        {/* 光晕效果 */}
        {hovered && <pointLight position={[0, 0, 10] as [number, number, number]} color="#d4a847" intensity={2} distance={3} />}
        
        {/* 点击粒子效果 */}
        {showParticles && <ParticleEffect position={position as [number, number, number]} />}
      </group>
    </Float>
  )
}

// 3D 场景
function GalleryScene({
  photos,
  onSelectPhoto,
  isMobile,
}: {
  photos: typeof weddingConfig.gallery
  onSelectPhoto: (photo: (typeof weddingConfig.gallery)[0]) => void
  isMobile: boolean
}) {
  const groupRef = React.useRef<THREE.Group>(null)

  // 自动旋转
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3
    }
  })

  // 环形排列照片 - 移动端调整半径
  const radius = isMobile ? 5 : 6
  const angleStep = (Math.PI * 2) / photos.length

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={isMobile ? [0, 0, 8] as [number, number, number] : [0, 0, 10] as [number, number, number]} 
        fov={isMobile ? 60 : 50} 
      />
      <OrbitControls
        enableZoom={isMobile ? false : true}
        enablePan={false}
        minDistance={isMobile ? 4 : 5}
        maxDistance={isMobile ? 12 : 15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={isMobile ? 0.3 : 0.5}
        touchEnabled={true}
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* 环境设置 */}
        <SceneEnvironment />

        {/* 照片墙组 */}
        <group ref={groupRef}>
          {photos.map((photo, index) => {
            const angle = angleStep * index
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius
            const rotationY = -angle + Math.PI

            return (
              <PhotoFrame
                key={photo.id}
                position={[x, 0, z] as [number, number, number]}
                rotation={[0, rotationY, 0] as [number, number, number]}
                photo={photo}
                index={index}
                onClick={() => onSelectPhoto(photo)}
              />
            )
          })}

          {/* 中心装饰 */}
          <CenterDecoration />
        </group>

        {/* 地面反射 */}
        <GroundReflection />
    </>
  )
}

// 场景环境组件
function SceneEnvironment() {
  return (
    <>
      {/* 环境光 */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#fff8e7" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#d4a847" />
        {/* 方向光 - 用于模拟阳光 */}
        <directionalLight
          color="#ffffff"
          intensity={0.6}
          position={[5, 5, 5]}
          castShadow
        />

      {/* 环境贴图 */}
      <Environment preset="sunset" />
    </>
  )
}

// 中心装饰组件
function CenterDecoration() {
  return (
      <Float speed={2} floatIntensity={0.5}>
        <mesh position={[0, 0, 0] as [number, number, number]}>
          <torusGeometry args={[0.5, 0.1, 16, 32, Math.PI * 2] as [number, number, number, number, number]} attach="geometry" />
        <meshStandardMaterial
          color="#d4a847"
          metalness={0.8}
          roughness={0.2}
          emissive="#d4a847"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

// 地面反射组件
function GroundReflection() {
  return (
    <mesh position={[0, -3, 0] as [number, number, number]} rotation={[-Math.PI / 2, 0, 0] as [number, number, number]}>
          <planeGeometry args={[50, 50] as [number, number]} attach="geometry" />
      <meshStandardMaterial color="#1a1a18" metalness={0.8} roughness={0.4} transparent opacity={0.5} />
    </mesh>
  )
}

// 粒子效果组件
  function ParticleEffect({ position }: { position: [number, number, number] }) {
    const particlesRef = React.useRef<THREE.Points>(null)
    const [particles, setParticles] = React.useState<Float32Array | null>(null)
    const [sizes, setSizes] = React.useState<Float32Array | null>(null)
    const [colors, setColors] = React.useState<Float32Array | null>(null)
    const [lifes, setLifes] = React.useState<Float32Array | null>(null)
    const [velocities, setVelocities] = React.useState<Float32Array | null>(null)
    
    // 初始化粒子
      React.useEffect(() => {
      const particleCount = 30
    
    // 粒子位置
    const newParticles = new Float32Array(particleCount * 3)
    // 粒子大小
    const newSizes = new Float32Array(particleCount)
    // 粒子颜色
    const newColors = new Float32Array(particleCount * 3)
    // 粒子生命周期
    const newLifes = new Float32Array(particleCount)
    // 粒子速度
    const newVelocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // 初始位置
      newParticles[i3] = position[0]
      newParticles[i3 + 1] = position[1]
      newParticles[i3 + 2] = position[2]
      
      // 随机速度
      newVelocities[i3] = (Math.random() - 0.5) * 0.6
      newVelocities[i3 + 1] = (Math.random() - 0.5) * 0.6
      newVelocities[i3 + 2] = (Math.random() - 0.5) * 0.6
      
      // 粒子大小
      newSizes[i] = Math.random() * 0.03 + 0.01
      
      // 粒子颜色（金色渐变）
      newColors[i3] = 0.83 + Math.random() * 0.17 // R
      newColors[i3 + 1] = 0.65 + Math.random() * 0.15 // G
      newColors[i3 + 2] = 0.28 + Math.random() * 0.12 // B
      
      // 生命周期
      newLifes[i] = Math.random() * 0.5 + 0.5
    }

    setParticles(newParticles)
    setSizes(newSizes)
    setColors(newColors)
    setLifes(newLifes)
    setVelocities(newVelocities)
  }, [position])

  // 粒子动画
  useFrame((state) => {
    if (!particles || !velocities || !lifes || !particlesRef.current) return

    for (let i = 0; i < particles.length / 3; i++) {
      const i3 = i * 3
      
      // 更新位置
      particles[i3] += velocities[i3] * 0.1
      particles[i3 + 1] += velocities[i3 + 1] * 0.1
      particles[i3 + 2] += velocities[i3 + 2] * 0.1
      
      // 重力效果
      velocities[i3 + 1] -= 0.002
      
      // 更新生命周期
      lifes[i] -= 0.01
      
      // 重置粒子
      if (lifes[i] <= 0) {
        particles[i3] = position[0]
        particles[i3 + 1] = position[1]
        particles[i3 + 2] = position[2]
        velocities[i3] = (Math.random() - 0.5) * 0.6
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.6
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.6
        lifes[i] = Math.random() * 0.5 + 0.5
      }
    }

    // 更新几何体
    if (particlesRef.current.geometry) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (!particles || !sizes || !colors) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[particles, 3] as [Float32Array, number]}
          attach="attributes-position"
          count={particles.length / 3}
        />
        <bufferAttribute
          args={[sizes, 1] as [Float32Array, number]}
          attach="attributes-size"
          count={sizes.length}
        />
        <bufferAttribute
          args={[colors, 3] as [Float32Array, number]}
          attach="attributes-color"
          count={colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.CustomBlending}
        depthWrite={false}
      />
    </points>
  )
}

// 加载占位 - 增强版
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-8 bg-graphite-900/80 backdrop-blur-lg rounded-2xl border border-gold-500/30 shadow-2xl">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h3 className="text-xl font-light text-gold-100 mb-2">加载3D画廊中</h3>
          <p className="text-gold-400/80 text-sm">正在准备沉浸式体验...</p>
        </div>
        <div className="w-48 h-1 bg-gold-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </Html>
  )
}

// 主组件
interface Gallery3DProps {
  className?: string
}

export function Gallery3D({ className }: Gallery3DProps) {
    const [selectedPhoto, setSelectedPhoto] = React.useState<(typeof weddingConfig.gallery)[0] | null>(null)
    const [showModal, setShowModal] = React.useState(false)
  const { gallery } = weddingConfig
  const [isMobile, setIsMobile] = React.useState(false)

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="gallery-3d" className={cn("relative", className)}>
      {/* 3D Canvas */}
      <div className={`w-full ${isMobile ? 'h-[80vh]' : 'h-screen'} bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900`}>
        {/* 标题覆盖层 */}
        <div className="absolute top-4 md:top-8 left-0 right-0 z-10 text-center pointer-events-none">
          <p className="text-gold-400 text-xs md:text-sm tracking-[0.3em] mb-2">3D GALLERY</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gold-100">沉浸式画廊</h2>
        </div>

        {/* 操作提示 */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-10 text-center pointer-events-none">
          <p className="text-gold-400/60 text-xs md:text-sm">{isMobile ? '拖动旋转 · 点击查看详情' : '拖动旋转 · 滚轮缩放 · 点击查看详情'}</p>
        </div>

        {/* 暂时移除ErrorBoundary组件，避免类型错误 */}
          <Canvas 
            gl={{ antialias: true, alpha: true }} 
            dpr={isMobile ? 1 : [1, 2]} 
            aria-label="3D 照片画廊 - 可拖动旋转查看，点击照片查看详情" 
          >
            <Suspense fallback={<LoadingFallback />}>
              <GalleryScene 
                photos={gallery} 
                onSelectPhoto={setSelectedPhoto} 
                isMobile={isMobile} 
              />
            </Suspense>
          </Canvas>
        {/* ErrorBoundary组件结束 */}
      </div>

      {/* 照片详情弹窗 */}
      <DraggableModal
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title}
        width={isMobile ? '90vw' : 500}
        height={isMobile ? '80vh' : undefined}
        variant="glass-dark"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            {/* 照片展示 */}
            <div className="aspect-video rounded-xl bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-gold-400/30 flex items-center justify-center border border-gold-500/30 relative overflow-hidden">
              <span className="text-7xl text-gold-400/50 font-light">{selectedPhoto.id}</span>
              {/* 实际照片 */}
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="absolute inset-0 w-full h-full object-contain"
                onLoad={(e) => {
                      // 图片加载成功后的处理
                      const target = e.target as HTMLImageElement;
                      if (target) target.style.opacity = '1';
                    }}
                  onError={(e) => {
                      // 图片加载失败时隐藏
                      const target = e.target as HTMLImageElement;
                    if (target) target.style.display = 'none';
                  }}
              />
            </div>

            {/* 信息 */}
            <div>
              <h3 className="text-lg font-medium text-gold-100 mb-2">{selectedPhoto.title}</h3>
              <p className="text-gold-300/70">{selectedPhoto.description}</p>
            </div>

            {/* 互动按钮 */}
            <div className="flex items-center gap-3 pt-4 border-t border-gold-500/20">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-sm">喜欢</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 transition-colors">
                <Music className="h-4 w-4" />
                <span className="text-sm">播放配乐</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">留言</span>
              </button>
            </div>
          </div>
        )}
      </DraggableModal>
    </section>
  )
}
