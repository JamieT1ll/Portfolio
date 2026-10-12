"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

function Orb() {
  const orbRef = useRef<THREE.Group>(null)
  const orbitRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    // Slowly rotate the central low-poly orb
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.35
      orbRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }

    // Move the small node around the ring
    if (orbitRef.current) {
      orbitRef.current.rotation.z += delta * 1.8
    }
  })

  return (
    <group>

      {/* CENTRAL ORB */}
      <group ref={orbRef}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />

          <meshStandardMaterial
            color="#02C39A"
            roughness={0.45}
            metalness={0.1}
            flatShading
          />
        </mesh>
      </group>

      {/* RING + ORBITING NODE */}
      <group rotation={[Math.PI / 2.5, 0.3, 0]}>

        {/* Ring stays visible */}
        <mesh>
          <torusGeometry args={[1.45, 0.025, 8, 48]} />

          <meshStandardMaterial
            color="#F0F3BD"
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* This pivot spins around the ring */}
        <group ref={orbitRef}>

          {/* Node sits exactly at ring radius */}
          <mesh position={[1.45, 0, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />

            <meshStandardMaterial
              color="#F0F3BD"
              emissive="#02C39A"
              emissiveIntensity={0.6}
            />
          </mesh>

        </group>
      </group>

    </group>
  )
}

export function BuildingOrb() {
  return (
    <div className="h-12 w-full md:h-32">
      <Canvas
        className="!pointer-events-none"
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1.4} />

        <directionalLight
          position={[3, 4, 5]}
          intensity={2}
        />

        <Orb />
      </Canvas>
    </div>
  )
}