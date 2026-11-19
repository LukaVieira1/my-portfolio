import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParallaxField } from "./ParallaxField";
import { useTheme } from "../../contexts/ThemeContext";
import { assert } from "../../lib/assert";
import { subscribeScrollProgress } from "../../lib/scrollStore";

function SceneContent() {
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#E86A33" : "#C73E1D";
  const ink = theme === "dark" ? "#9AA8B5" : "#1A2332";
  const fogColor = theme === "dark" ? "#0F1419" : "#E9EEF2";

  assert(accent.length > 0, "accent color missing");

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 7, 16]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 4]} intensity={0.85} />
      <directionalLight position={[-6, -1, 2]} intensity={0.3} />
      <ParallaxField accent={accent} ink={ink} />
    </>
  );
}

export function ScrollScene() {
  const [fade, setFade] = useState(1);
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio, 1.6);
  }, []);

  useEffect(() => {
    return subscribeScrollProgress((progress) => {
      if (progress < 0.72) setFade(1);
      else if (progress > 0.9) setFade(0);
      else setFade(1 - (progress - 0.72) / 0.18);
    });
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{ opacity: fade }}
      aria-hidden
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6.4], fov: 42, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          assert(gl.getContext() != null, "WebGL context failed to initialize");
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
