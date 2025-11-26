"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Text, Html, OrbitControls, PerspectiveCamera, Float } from "@react-three/drei"
import type * as THREE from "three"
import { cn } from "@/lib/utils"
import { weddingConfig } from "@/lib/wedding-config"
import { DraggableModal } from "@/components/draggable-modal"
import { Heart, Music, MessageSquare } from "lucide-react"

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
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
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
      <group position={position} rotation={rotation}>
        {/* 画框边框 */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[2.4, 1.8, 0.15]} />
          <meshStandardMaterial color={hovered ? "#d4a847" : "#5f4a20"} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* 画布内容 */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[2.1, 1.5]} />
          <meshStandardMaterial color={colorPair[0]} metalness={0.1} roughness={0.8} />
        </mesh>

        {/* 照片编号 */}
        <Text
          position={[0, 0, 0.1]}
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
          <Html position={[0, -1.2, 0]} center distanceFactor={10}>
            <div className="px-4 py-2 rounded-lg bg-graphite-900/90 backdrop-blur-sm border border-gold-500/30 whitespace-nowrap">
              <p className="text-gold-100 text-sm font-medium">{photo.title}</p>
              <p className="text-gold-400/70 text-xs">{photo.description}</p>
            </div>
          </Html>
        )}

        {/* 光晕效果 */}
        {hovered && <pointLight position={[0, 0, 1]} color="#d4a847" intensity={2} distance={3} />}
      </group>
    </Float>
  )
}

// 3D 场景
function GalleryScene({
  photos,
  onSelectPhoto,
}: {
  photos: typeof weddingConfig.gallery
  onSelectPhoto: (photo: (typeof weddingConfig.gallery)[0]) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  // 自动旋转
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3
    }
  })

  // 环形排列照片
  const radius = 6
  const angleStep = (Math.PI * 2) / photos.length

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#fff8e7" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#d4a847" />

      {/* 环境贴图 */}
      <Environment preset="sunset" />

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
              position={[x, 0, z]}
              rotation={[0, rotationY, 0]}
              photo={photo}
              index={index}
              onClick={() => onSelectPhoto(photo)}
            />
          )
        })}

        {/* 中心装饰 */}
        <Float speed={2} floatIntensity={0.5}>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.5, 0.1, 16, 32]} />
            <meshStandardMaterial
              color="#d4a847"
              metalness={0.8}
              roughness={0.2}
              emissive="#d4a847"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      </group>

      {/* 地面反射 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a18" metalness={0.8} roughness={0.4} transparent opacity={0.5} />
      </mesh>
    </>
  )
}

// 加载占位
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gold-400 text-sm">加载3D画廊中...</p>
      </div>
    </Html>
  )
}

// 主组件
interface Gallery3DProps {
  className?: string
}

export function Gallery3D({ className }: Gallery3DProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof weddingConfig.gallery)[0] | null>(null)
  const { gallery } = weddingConfig

  return (
    <section id="gallery-3d" className={cn("relative", className)}>
      {/* 3D Canvas */}
      <div className="w-full h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900">
        {/* 标题覆盖层 */}
        <div className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none">
          <p className="text-gold-400 text-sm tracking-[0.3em] mb-2">3D GALLERY</p>
          <h2 className="text-3xl md:text-4xl font-light text-gold-100">沉浸式画廊</h2>
        </div>

        {/* 操作提示 */}
        <div className="absolute bottom-8 left-0 right-0 z-10 text-center pointer-events-none">
          <p className="text-gold-400/60 text-sm">拖动旋转 · 滚轮缩放 · 点击查看详情</p>
        </div>

        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <Suspense fallback={<LoadingFallback />}>
            <GalleryScene photos={gallery} onSelectPhoto={setSelectedPhoto} />
          </Suspense>
        </Canvas>
      </div>

      {/* 照片详情弹窗 */}
      <DraggableModal
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title}
        width={500}
        variant="glass-dark"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            {/* 照片展示 */}
            <div className="aspect-video rounded-xl bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-gold-400/30 flex items-center justify-center border border-gold-500/30">
              <span className="text-7xl text-gold-400/50 font-light">{selectedPhoto.id}</span>
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
