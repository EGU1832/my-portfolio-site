"use client";

import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function CatModel({
  active
}: {
  active: boolean;
}) {
  const ref = useRef<any>(null);

  // GLB 로드 (vertex color / 축 / 스케일 이미 정리됨)
  const { scene, animations } = useGLTF("/models/an_animated_cat.glb");
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (!firstAction) return;

    if (active) {
      firstAction.reset().fadeIn(0.2).play();
    } else {
      firstAction.fadeOut(0.2);
    }

    return () => {
      firstAction.fadeOut(0.2);
    };
  }, [active, actions]);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.05}          // 필요하면 여기서만 조절
      position={[-0.15, -0.5, 0]}
      rotation={[0, 1.75 * Math.PI, 0]}
    />
  );
}

// components/HeroPhoto.tsx
// ProfileCat 대신 이력서용 배포(SITE_MODE=resume)에서 노출되는 실제 프로필 사진.
export default function HeroPhoto() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* ================= 카드 영역 ================= */}
      <div
        className="relative h-52 w-40 rounded-2xl border border-[#4f6f58]/40 bg-[#18251c] overflow-hidden"
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
      >
        {/* ===== 2D 이미지 ===== */}
        <Image
          src="/api/hero-image"
          alt="Profile photo"
          fill
          sizes="160px"
          priority
          className={`
            object-cover transition-all duration-300
            ${hovered ? "opacity-0 scale-90" : "opacity-100 scale-100"}
          `}
        />

        {/* ===== 3D Canvas ===== */}
        <div
          className={`
            absolute inset-0 transition-all duration-300
            ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}
          `}
          style={{ pointerEvents: hovered ? "auto" : "none" }}
        >
          <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 3, 2]} intensity={2} />

            <CatModel active={hovered}/>
          </Canvas>
        </div>
      </div>
    </div>
  );  
}

useGLTF.preload("/models/an_animated_cat.glb");