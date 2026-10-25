import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CanvasField } from "./CanvasField";
import { hasWebGL } from "../lib/webgl";

interface ParticleFieldProps {
  reduced: boolean;
}

export default function ParticleField({ reduced }: ParticleFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;
    if (!hasWebGL()) {
      setFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let geo: THREE.BufferGeometry | null = null;
    let mat: THREE.PointsMaterial | null = null;
    let glowGeo: THREE.BufferGeometry | null = null;
    let glowMat: THREE.PointsMaterial | null = null;
    let raf = 0;

    try {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const count = mobile ? 1200 : 2800;
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false,
      });
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, width / Math.max(height, 1), 0.1, 100);
      camera.position.z = 7;

      const positions = new Float32Array(count * 3);
      const originals = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 12;
        const y = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 7;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originals[i * 3] = x;
        originals[i * 3 + 1] = y;
        originals[i * 3 + 2] = z;
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      mat = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: mobile ? 0.075 : 0.052,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const glowCount = mobile ? 60 : 120;
      const glowPos = new Float32Array(glowCount * 3);
      for (let i = 0; i < glowCount; i++) {
        glowPos[i * 3] = (Math.random() - 0.5) * 10;
        glowPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
        glowPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      }
      glowGeo = new THREE.BufferGeometry();
      glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
      glowMat = new THREE.PointsMaterial({
        color: 0x9ffff0,
        size: mobile ? 0.16 : 0.12,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      scene.add(new THREE.Points(glowGeo, glowMat));

      const pointer = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * -2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let time = 0;
      const tick = () => {
        if (!renderer || !geo) return;
        time += 0.008;
        const scroll = window.scrollY / Math.max(window.innerHeight, 1);
        const attr = geo.getAttribute("position") as THREE.BufferAttribute;
        const arr = attr.array as Float32Array;
        const step = mobile ? 3 : 2;
        for (let i = 0; i < count; i += step) {
          const ix = i * 3;
          const ox = originals[ix];
          const oy = originals[ix + 1];
          const oz = originals[ix + 2];
          const push = Math.exp(-((ox - pointer.x * 4) ** 2 + (oy - pointer.y * 3) ** 2) / 6);
          arr[ix] = ox + pointer.x * 0.55 * push;
          arr[ix + 1] = oy + pointer.y * 0.45 * push + Math.sin(time + ox) * 0.06;
          arr[ix + 2] = oz + scroll * 0.8;
        }
        attr.needsUpdate = true;
        points.rotation.y += 0.0018 + Math.abs(pointer.x) * 0.003;
        points.rotation.x = pointer.y * 0.16 + scroll * 0.22;
        points.position.z = scroll * 2.6;
        camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.05;
        camera.position.y += (pointer.y * 0.45 - camera.position.y) * 0.05;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      const onResize = () => {
        if (!renderer) return;
        const nextW = host.clientWidth || window.innerWidth;
        const nextH = host.clientHeight || window.innerHeight;
        renderer.setSize(nextW, nextH, false);
        camera.aspect = nextW / Math.max(nextH, 1);
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", onResize);
        geo?.dispose();
        mat?.dispose();
        glowGeo?.dispose();
        glowMat?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch {
      renderer?.dispose();
      renderer?.domElement.remove();
      host.replaceChildren();
      setFailed(true);
    }
  }, [reduced]);

  if (reduced) return null;
  if (failed) return <CanvasField />;
  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0" />;
}
