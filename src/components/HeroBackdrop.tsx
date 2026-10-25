import { lazy, Suspense, useEffect, useState } from "react";
import { CanvasField } from "./CanvasField";
import { ErrorBoundary } from "./ErrorBoundary";
import { hasWebGL } from "../lib/webgl";

const ParticleField = lazy(() => import("./ParticleField"));

interface HeroBackdropProps {
  reduced: boolean;
}

export function HeroBackdrop({ reduced }: HeroBackdropProps) {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    if (!reduced) setWebgl(hasWebGL());
  }, [reduced]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_28%_42%,rgba(100,255,218,0.16),transparent_52%)]" />
      {reduced ? null : webgl ? (
        <ErrorBoundary fallback={<CanvasField />}>
          <Suspense fallback={<CanvasField />}>
            <ParticleField reduced={false} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <CanvasField />
      )}
    </>
  );
}
