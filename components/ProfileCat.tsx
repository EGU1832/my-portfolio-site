"use client";

import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

/* ===================== */
/* 3D CAT MODEL (GLB) */
/* ===================== */

function CatModel({
  active,
  autoSpin,
}: {
  active: boolean;
  autoSpin: boolean;
}) {
  const ref = useRef<any>(null);

  // GLB 로드 (vertex color / 축 / 스케일 이미 정리됨)
  const { scene } = useGLTF("/models/cat_pixel_v3.glb");

  useFrame((state) => {
    if (!ref.current) return;

    if (active || autoSpin) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y += 0.35;
      ref.current.position.y = Math.sin(t * 12) * 0.08;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.125}          // 필요하면 여기서만 조절
      position={[0, 0, 0]}
    />
  );
}

function RainbowBackground({
  active,
  setHue,
}: {
  active: boolean;
  setHue: (h: number) => void;
}) {
  const { gl } = useThree();

  useFrame((state) => {
    if (!active) return;

    const t = state.clock.getElapsedTime();
    const hue = (t * 0.8) % 1.0;

    setHue(hue);

    const color = new THREE.Color().setHSL(hue, 0.7, 0.45);
    gl.setClearColor(color);
  });

  return null;
}


function RainbowText({
  hue,
  children,
}: {
  hue: number;
  children: React.ReactNode;
}) {
  const color = new THREE.Color().setHSL(hue, 0.8, 0.6);

  return (
    <span
      style={{ color: `#${color.getHexString()}` }}
      className="
        text-[10px]
        tracking-wide
        whitespace-nowrap
      "
    >
      {children}
    </span>
  );
}


/* ===================== */
/* PROFILE CAT WRAPPER */
/* ===================== */

export default function ProfileCat() {
  const [hovered, setHovered] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [hasHoveredOnce, setHasHoveredOnce] = useState(false);
  const [rainbowHue, setRainbowHue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSpin(false); // 1초 후 자동 스핀 종료
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* ================= 카드 영역 ================= */}
      <div
        className="relative h-40 w-40 rounded-2xl border border-[#4f6f58]/40 bg-[#18251c] overflow-hidden"
        onMouseEnter={() => {
          setHovered(true);
          setHasHoveredOnce(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
      >
        {/* ===== 2D 이미지 ===== */}
        <Image
          src="/images/Profile_v1_lite.png"
          alt="Pixel black cat"
          fill
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
            ${hovered || autoSpin ? "opacity-100 scale-100" : "opacity-0 scale-110"}
          `}
          style={{ pointerEvents: hovered ? "auto" : "none" }}
        >
          <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }}>
            <RainbowBackground active={hovered} setHue={setRainbowHue} />

            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 3, 2]} intensity={2} />

            <CatModel active={hovered} autoSpin={autoSpin} />
          </Canvas>
        </div>
      </div>

      {/* ================= 문구 영역 (고정 슬롯) ================= */}
      <div className="relative mt-2 h-[14px] flex items-center justify-center">
        {!autoSpin && !hasHoveredOnce && (
          <span className="text-[10px] tracking-wide text-[#9fd3a8]/60 whitespace-nowrap">
            What was that..?
          </span>
        )}

        {hovered && (
          <RainbowText hue={rainbowHue}>
            O-i-i-a-i-o o-i-i-i-a-i
          </RainbowText>
        )}
      </div>
    </div>
  );
}

/* GLTF preload (선택이지만 권장) */
useGLTF.preload("/models/cat_pixel_v3.glb");
