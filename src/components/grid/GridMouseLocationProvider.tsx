import { type MouseEvent, type ReactNode, useRef, useState } from "react";

/** A mouse position in grid (SVG user-space) coordinates. Not rounded to a tile. */
export type MousePosition = [number, number];

interface GridMouseLocationProviderProps {
  children: (mousePosition: MousePosition | null) => ReactNode;
  onClick?: (mousePosition: MousePosition | null) => void;
}

// TODO: Find a way to have multiple of these without the performance penalty
// TODO: Consider moving this stuff into the context of the top component
const GridMouseLocationProvider = ({ children, onClick }: GridMouseLocationProviderProps) => {
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const gRef = useRef<SVGGElement>(null);

  const extractMousePosition = (event: MouseEvent<SVGElement>): MousePosition | null => {
    const svg = gRef.current?.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) {
      return null;
    }
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const p2 = p.matrixTransform(ctm.inverse());
    return [p2.x, p2.y];
  };

  return (
    <g ref={gRef} onClick={onClick && ((event) => onClick(extractMousePosition(event)))}>
      {children(mousePosition)}
      <rect
        fill="transparent"
        height={15} // TODO: Don't hard code this
        onMouseLeave={() => setMousePosition(null)}
        onMouseMove={(event) => setMousePosition(extractMousePosition(event))}
        width={15} // TODO: Don't hard code this
        x={0}
        y={0}
      />
    </g>
  );
};

export default GridMouseLocationProvider;
