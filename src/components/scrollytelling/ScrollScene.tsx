import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { GeometryTunnel } from "./GeometryTunnel";
import { useTheme } from "../../contexts/ThemeContext";
import { assert } from "../../lib/assert";

function SceneContent() {
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#E86A33" : "#C73E1D";
  const fogColor = theme === "dark" ? "#0F1419" : "#E9EEF2";

  assert(accent.length > 0, "accent color missing");
  assert(fogColor.length > 0, "fog color missing");

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 3.5, 22]} />
      <ambientLight intensity={0.6} />
      <GeometryTunnel accent={accent} />
    </>
  );
}

export function ScrollScene() {
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio, 1.75);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 7.5], fov: 55, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          const context = gl.getContext();
          assert(context != null, "WebGL context failed to initialize");
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
