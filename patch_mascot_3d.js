const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Mascot3D.js');
let code = fs.readFileSync(filePath, 'utf8');

const newModelFunction = `function Model({ url, isSpeaking }) {
  const { scene, nodes, animations } = useGLTF(url);
  const groupRef = useRef();

  // Basic idle animation + slight speaking animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Idle float
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 2) * 0.05;

      // Slight rotation towards the user
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;

      // Speaking jitter (simple scale bounce)
      if (isSpeaking) {
          groupRef.current.scale.y = 1 + Math.sin(t * 15) * 0.02;

          // If the model has jawOpen morph target (common in GLB)
          scene.traverse((child) => {
             if (child.isMesh && child.morphTargetDictionary && child.morphTargetDictionary.jawOpen !== undefined) {
                 child.morphTargetInfluences[child.morphTargetDictionary.jawOpen] = Math.abs(Math.sin(t * 20)); // Rapid open close
             }
             if (child.isMesh && child.morphTargetDictionary && child.morphTargetDictionary.mouthOpen !== undefined) {
                 child.morphTargetInfluences[child.morphTargetDictionary.mouthOpen] = Math.abs(Math.sin(t * 20));
             }
          });
      } else {
          groupRef.current.scale.y = 1;
          scene.traverse((child) => {
             if (child.isMesh && child.morphTargetDictionary && child.morphTargetDictionary.jawOpen !== undefined) {
                 child.morphTargetInfluences[child.morphTargetDictionary.jawOpen] = 0;
             }
             if (child.isMesh && child.morphTargetDictionary && child.morphTargetDictionary.mouthOpen !== undefined) {
                 child.morphTargetInfluences[child.morphTargetDictionary.mouthOpen] = 0;
             }
          });
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={2} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
  );
}`;

code = code.replace(/function Model\(\{ url, isSpeaking \}\) \{[\s\S]*?  \);\n\}/, newModelFunction);

fs.writeFileSync(filePath, code);
