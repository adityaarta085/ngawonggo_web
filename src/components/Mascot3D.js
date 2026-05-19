import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { FaTimes, FaRobot } from 'react-icons/fa';

function Model({ url, isSpeaking }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  // Basic idle animation + slight speaking animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Idle float
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 2) * 0.05;

      // Slight rotation towards the user
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;

      // Speaking jitter (simple scale bounce) and mouth movement
      if (isSpeaking) {
          groupRef.current.scale.y = 1 + Math.sin(t * 15) * 0.02;

          // Animate jaw bone if morph targets don't exist
          scene.traverse((child) => {
             if (child.isBone && (child.name.toLowerCase().includes('jaw') || child.name.toLowerCase().includes('mouth'))) {
                 child.rotation.x = Math.abs(Math.sin(t * 20)) * 0.2; // Rotate jaw bone down
             } else if (child.isMesh && child.morphTargetDictionary) {
                 if (child.morphTargetDictionary.jawOpen !== undefined) {
                     child.morphTargetInfluences[child.morphTargetDictionary.jawOpen] = Math.abs(Math.sin(t * 20));
                 }
                 if (child.morphTargetDictionary.mouthOpen !== undefined) {
                     child.morphTargetInfluences[child.morphTargetDictionary.mouthOpen] = Math.abs(Math.sin(t * 20));
                 }
             }
          });
      } else {
          groupRef.current.scale.y = 1;
          scene.traverse((child) => {
             if (child.isBone && (child.name.toLowerCase().includes('jaw') || child.name.toLowerCase().includes('mouth'))) {
                 child.rotation.x = 0; // Reset jaw bone
             } else if (child.isMesh && child.morphTargetDictionary) {
                 if (child.morphTargetDictionary.jawOpen !== undefined) {
                     child.morphTargetInfluences[child.morphTargetDictionary.jawOpen] = 0;
                 }
                 if (child.morphTargetDictionary.mouthOpen !== undefined) {
                     child.morphTargetInfluences[child.morphTargetDictionary.mouthOpen] = 0;
                 }
             }
          });
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={2} position={[0, -1.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Mascot3D() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
      const handleSpeaking = (e) => setIsSpeaking(e.detail);
      window.addEventListener('azma-speaking', handleSpeaking);
      return () => window.removeEventListener('azma-speaking', handleSpeaking);
  }, []);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
      return (
          <Tooltip label="Tampilkan Azma" placement="right">
              <IconButton
                  icon={<FaRobot />}
                  position="fixed"
                  bottom="20px"
                  left="20px"
                  colorScheme="blue"
                  isRound
                  zIndex={9999}
                  onClick={() => setIsVisible(true)}
                  boxShadow="lg"
                  aria-label="Tampilkan Maskot"
              />
          </Tooltip>
      );
  }

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="20px"
      width="150px"
      height="200px"
      zIndex={9999}
      pointerEvents="auto"
    >
      <IconButton
        icon={<FaTimes />}
        size="xs"
        position="absolute"
        top="0"
        right="0"
        colorScheme="red"
        isRound
        zIndex={10000}
        onClick={() => setIsVisible(false)}
        aria-label="Tutup Maskot"
        opacity={0.7}
        _hover={{ opacity: 1 }}
      />
      <Canvas camera={{ position: [0, 1, 4], fov: 40 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Environment preset="city" />
        <Model url="/azma.glb" isSpeaking={isSpeaking} />
      </Canvas>
    </Box>
  );
}
