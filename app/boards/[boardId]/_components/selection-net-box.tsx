import { CanvasMode, CanvasState } from "@/types/canvas";
import { memo } from "react";

export const SelectionNetBox = memo(
  ({ canvasState }: { canvasState: CanvasState }) => {
    if (canvasState.mode !== CanvasMode.SelectNet) {
      return null;
    }
    if (!canvasState.current) {
      return null;
    }
    const { origin, current } = canvasState;
    const x = Math.min(origin.x, current.x);
    const y = Math.min(origin.y, current.y);
    const width = Math.abs(origin.x - current.x);
    const height = Math.abs(origin.y - current.y);
    return (
      <rect
        className="fill-blue-500/5 stroke-blue-500 stroke-1"
        x={x}
        y={y}
        width={width}
        height={height}
      ></rect>
    );
  }
);
SelectionNetBox.displayName = "SelectionNetBox";
