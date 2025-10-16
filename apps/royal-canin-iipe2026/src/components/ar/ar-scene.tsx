import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

interface ARSceneProps {
  onModelClick: () => void
  isInteractive: boolean
}

/**
 * BicolorCat Component with debugging
 */
function BicolorCat({ onModelClick, isInteractive }: ARSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Load model
  const { scene } = useGLTF('/src/assets/3d/bicolor_cat.glb')

  useEffect(() => {
    if (scene) {
      // Calculate bounding box to understand model size
      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()
      box.getSize(size)

      // Center the model
      const center = box.getCenter(new THREE.Vector3())
      scene.position.set(-center.x, -center.y, -center.z)
    }
  }, [scene])

  // Rotate animation
  // useFrame(() => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.01
  //   }
  // })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (isInteractive) {
      onModelClick()
    }
  }

  return (
    <group
      ref={groupRef}
      position={[0, 1, 0]} // Raise position
      scale={4} // Scale UP significantly (was 0.5, now 2)
      onClick={handleClick}
    >
      {/* Debug: Wireframe box to show where cat should be */}
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="yellow" wireframe />
      </mesh> */}

      <primitive object={scene} />

      {/* Highlight ring */}
      {/* {isInteractive && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )} */}
    </group>
  )
}

/**
 * ARScene Component
 * Main 3D scene with lighting and environment
 */
export default function ARScene({ onModelClick, isInteractive }: ARSceneProps) {
  return (
    <>
      {/* Lighting setup - brighter for visibility */}
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />
      <directionalLight
        position={[-5, 3, -5]}
        intensity={1}
      />

      {/* Bicolor Cat Model - center (main object) */}
      <BicolorCat
        onModelClick={onModelClick}
        isInteractive={isInteractive}
      />
    </>
  )
}

// Preload the cat model
useGLTF.preload('/src/assets/3d/bicolor_cat.glb')
