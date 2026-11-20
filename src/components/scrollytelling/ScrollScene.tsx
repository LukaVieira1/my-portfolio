import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParallaxField } from "./ParallaxField";
import { useTheme } from "../../contexts/ThemeContext";
import { assert } from "../../lib/assert";
import { subscribeScrollProgress } from "../../lib/scrollStore";
import { useIsNarrow } from "../../hooks/useIsNarrow";

function SceneContent({ intensity }: { intensity: number }) {
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#E86A33" : "#C73E1D";
  const ink = theme === "dark" ? "#9AA8B5" : "#1A2332";
  const fogColor = theme === "dark" ? "#0F1419" : "#E9EEF2";

  assert(accent.length > 0, "accent color missing");
  assert(intensity > 0 && intensity <= 1, `invalid intensity ${intensity}`);

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 7, 16]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 4]} intensity={0.85} />
      <directionalLight position={[-6, -1, 2]} intensity={0.3} />
      <ParallaxField accent={accent} ink={ink} intensity={intensity} />
    </>
  );
}

export function ScrollScene() {
  const narrow = useIsNarrow();
  const [scrollFade, setScrollFade] = useState(1);
  const dpr = useMemo(() => {
    assert(typeof window !== "undefined", "window required for dpr");
    return Math.min(window.devicePixelRatio, narrow ? 1.25 : 1.6);
  }, [narrow]);

  // atmosfera editorial contida — não compete com tipografia
  const intensity = narrow ? 0.28 : 0.45;
  const fade = scrollFade * (narrow ? 0.55 : 0.7);

  useEffect(() => {
    return subscribeScrollProgress((progress) => {
      if (progress < 0.72) setScrollFade(1);
      else if (progress > 0.9) setScrollFade(0);
      else setScrollFade(1 - (progress - 0.72) / 0.18);
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
        camera={{ position: [0, 0, narrow ? 7.2 : 6.4], fov: narrow ? 48 : 42, near: 0.1, far: 40 }}
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
          <SceneContent intensity={intensity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
