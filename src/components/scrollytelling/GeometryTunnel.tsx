import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "../../lib/scrollStore";
import { assert } from "../../lib/assert";

const RING_COUNT = 18;
const FLOATER_COUNT = 12;

function createRingGeometry() {
  return new THREE.TorusGeometry(3.2, 0.035, 12, 96);
}

function createFloaterGeometry() {
  return new THREE.IcosahedronGeometry(0.28, 0);
}

export function GeometryTunnel({ accent }: { accent: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const floatersRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const ringGeo = useMemo(() => createRingGeometry(), []);
  const floaterGeo = useMemo(() => createFloaterGeometry(), []);
  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(1.1, 0), []);

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accent,
        wireframe: true,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      }),
    [accent],
  );

  const floaterMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accent,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    [accent],
  );

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accent,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    [accent],
  );

  const floaterOffsets = useMemo(() => {
    return Array.from({ length: FLOATER_COUNT }, (_, i) => {
      const angle = (i / FLOATER_COUNT) * Math.PI * 2;
      const radius = 1.6 + (i % 3) * 0.45;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 1.3) * 1.1,
        z: -i * 1.35 - 1,
        speed: 0.4 + (i % 5) * 0.12,
        spin: 0.6 + (i % 4) * 0.2,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const progress = getScrollProgress();
    assert(progress >= 0 && progress <= 1, `invalid scroll progress ${progress}`);

    const camera = state.camera;
    const t = progress;

    // Fly through the ring tunnel — enveloping feel
    camera.position.x = Math.sin(t * Math.PI * 2) * 0.55;
    camera.position.y = Math.cos(t * Math.PI * 1.5) * 0.35;
    camera.position.z = 7.5 - t * 22;
    camera.lookAt(
      Math.sin(t * Math.PI) * 0.2,
      Math.cos(t * Math.PI * 0.8) * 0.15,
      camera.position.z - 4,
    );

    if (groupRef.current) {
      groupRef.current.rotation.z = t * Math.PI * 0.65;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8 + i * 0.35) * 0.03;
        const envelop = 1 + t * 0.22 + Math.sin(t * Math.PI + i * 0.2) * 0.08;
        mesh.scale.setScalar(breathe * envelop);
        mesh.rotation.z += delta * (0.08 + (i % 3) * 0.02) * (i % 2 === 0 ? 1 : -1);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        // Peek near camera, fade farther rings so copy stays readable
        const proximity = 1 - Math.min(1, Math.abs(i / RING_COUNT - t) * 1.8);
        mat.opacity = 0.08 + proximity * 0.28;
      });
    }

    if (floatersRef.current) {
      floatersRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const offset = floaterOffsets[i];
        assert(offset != null, `missing floater offset at ${i}`);
        const orbit = state.clock.elapsedTime * offset.speed + i;
        mesh.position.x = offset.x + Math.sin(orbit) * 0.35;
        mesh.position.y = offset.y + Math.cos(orbit * 0.9) * 0.25;
        mesh.position.z = offset.z + t * -6;
        mesh.rotation.x += delta * offset.spin;
        mesh.rotation.y += delta * offset.spin * 0.7;
        mesh.scale.setScalar(0.7 + t * 0.9);
      });
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.25;
      coreRef.current.rotation.y += delta * 0.35;
      const pulse = 1.1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08 + t * 0.6;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.position.z = -2 - t * 10;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={ringsRef}>
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <mesh
            key={`ring-${i}`}
            geometry={ringGeo}
            material={ringMaterial}
            position={[0, 0, -i * 1.45]}
            rotation={[Math.PI / 2, 0, i * 0.15]}
          />
        ))}
      </group>

      <group ref={floatersRef}>
        {floaterOffsets.map((offset, i) => (
          <mesh
            key={`floater-${i}`}
            geometry={floaterGeo}
            material={floaterMaterial}
            position={[offset.x, offset.y, offset.z]}
          />
        ))}
      </group>

      <mesh ref={coreRef} geometry={octaGeo} material={coreMaterial} />
    </group>
  );
}
