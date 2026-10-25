import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  reduced: boolean;
}

export default function ParticleField({ reduced }: ParticleFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const count = mobile ? 700 : 2400;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 8;

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x64ffda,
      size: mobile ? 0.035 : 0.028,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    const tick = () => {
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);
      points.rotation.y += 0.0012 + Math.abs(pointer.x) * 0.002;
      points.rotation.x = pointer.y * 0.18 + scroll * 0.25;
      points.position.z = scroll * 3.2;
      camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0" />;
}
