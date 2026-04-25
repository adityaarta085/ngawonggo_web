import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const SphereBackground = ({ url }) => {
  const texture = useTexture(url);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
};

const PanoramaViewer = ({ url, difficulty }) => {
  return (
    <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
      <Suspense fallback={null}>
        <SphereBackground url={url} />
        <OrbitControls
          enableZoom={difficulty !== 'hardcore'}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={-0.5}
          enabled={difficulty !== 'hardcore'}
        />
      </Suspense>
    </Canvas>
  );
};

export default PanoramaViewer;
