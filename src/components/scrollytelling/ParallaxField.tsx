import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "../../lib/scrollStore";
import { assert } from "../../lib/assert";

type Layer = {
  side: -1 | 1;
  y: number;
  z: number;
  scale: [number, number, number];
  kind: "slab" | "block" | "octa";
  speed: number;
};

/**
 * Corredor de parallax: só laterais + profundidade.
 * Sem túnel central (evita scribble / risco no fim).
 */
export function ParallaxField({
  accent,
  ink,
}: {
  accent: string;
  ink: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);

  const slabGeo = useMemo(() => new THREE.BoxGeometry(1.8, 2.6, 0.12), []);
  const blockGeo = useMemo(() => new THREE.BoxGeometry(1.1, 1.1, 1.1), []);
  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.65, 0), []);

  const layers: Layer[] = useMemo(
    () => [
      { side: -1, y: 1.4, z: -9, scale: [1.4, 1.4, 1], kind: "slab", speed: 0.25 },
      { side: 1, y: -1.0, z: -9.5, scale: [1.6, 1.6, 1], kind: "slab", speed: 0.22 },
      { side: -1, y: -1.5, z: -7.5, scale: [1, 1, 1], kind: "block", speed: 0.4 },
      { side: 1, y: 1.8, z: -8, scale: [0.9, 0.9, 0.9], kind: "octa", speed: 0.35 },
      { side: -1, y: 0.3, z: -5.5, scale: [1.2, 1.2, 1], kind: "slab", speed: 0.55 },
      { side: 1, y: -0.6, z: -5.8, scale: [1.15, 1.15, 1], kind: "slab", speed: 0.5 },
      { side: -1, y: 2.0, z: -4.2, scale: [0.85, 0.85, 0.85], kind: "octa", speed: 0.7 },
      { side: 1, y: 0.9, z: -4.5, scale: [0.95, 0.95, 0.95], kind: "block", speed: 0.65 },
      { side: -1, y: -0.8, z: -2.8, scale: [1.05, 1.05, 1], kind: "slab", speed: 0.9 },
      { side: 1, y: 0.2, z: -3.0, scale: [0.8, 0.8, 0.8], kind: "octa", speed: 0.85 },
    ],
    [],
  );

  const materials = useMemo(
    () =>
      layers.map((_, i) => {
        const isAccent = i % 2 === 0;
        return new THREE.MeshStandardMaterial({
          color: isAccent ? accent : ink,
          roughness: 0.62,
          metalness: 0.04,
          transparent: true,
          opacity: 0.18,
          flatShading: true,
          depthWrite: false,
        });
      }),
    [accent, ink, layers],
  );

  useFrame((state, delta) => {
    const progress = getScrollProgress();
    assert(progress >= 0 && progress <= 1, `invalid scroll progress ${progress}`);

    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, Math.sin(progress * Math.PI) * 0.25, 4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, progress * -0.15, 4, delta);
    cam.position.z = 6.4;
    cam.lookAt(0, 0, -3);

    // some cedo e por completo — contato sem resíduo
    const endFade =
      progress < 0.72 ? 1 : progress > 0.9 ? 0 : 1 - (progress - 0.72) / 0.18;

    if (groupRef.current) {
      groupRef.current.visible = endFade > 0.02;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        progress * 0.12,
        3,
        delta,
      );
    }

    layers.forEach((layer, i) => {
      const mesh = layerRefs.current[i];
      if (!mesh) return;

      const baseX = layer.side * (7.1 + Math.abs(layer.z) * 0.1);
      const driftY =
        -progress * 4.2 * layer.speed +
        Math.sin(state.clock.elapsedTime * 0.35 + i) * 0.12;
      const driftX =
        layer.side *
        (progress * 0.55 * layer.speed +
          Math.sin(state.clock.elapsedTime * 0.2 + i * 0.7) * 0.06);

      mesh.position.x = baseX + driftX;
      mesh.position.y = layer.y + driftY;
      mesh.position.z = layer.z + progress * 2.2 * (1 - layer.speed * 0.35);

      // slabs quase de frente pra câmera — evita “risco” edge-on
      mesh.rotation.y = layer.side * 0.35;
      mesh.rotation.x = 0.12 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.05;
      mesh.rotation.z = layer.side * 0.08;

      if (progress > 0.72) {
        const exit = (progress - 0.72) / 0.28;
        mesh.position.x += layer.side * exit * 10;
        mesh.position.z -= exit * 8;
      }

      const mat = mesh.material as THREE.MeshStandardMaterial;
      const depthBoost = THREE.MathUtils.mapLinear(layer.z, -9.5, -2.8, 0.5, 1);
      mat.opacity = 0.1 * depthBoost * endFade + 0.04 * endFade;
    });
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => {
        const geo =
          layer.kind === "slab"
            ? slabGeo
            : layer.kind === "block"
              ? blockGeo
              : octaGeo;
        const mat = materials[i];
        assert(mat != null, `missing material ${i}`);
        return (
          <mesh
            key={`layer-${i}`}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            geometry={geo}
            material={mat}
            position={[layer.side * 6, layer.y, layer.z]}
            scale={layer.scale}
          />
        );
      })}
    </group>
  );
}
