import { resizeBound } from "@/lib/utils";
import { CanvasMode, CanvasState, Point, Side, XYWH } from "@/types/canvas";
import { useHistory, useMutation } from "@liveblocks/react/suspense";
import { useCallback } from "react";

export const useResizeLayer = ({
  canvasState,
  setCanvasState,
}: {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
}) => {
  const { pause } = useHistory();

  const onResizePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [pause, setCanvasState]
  );
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }
      const bounds = resizeBound(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );
      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  return { onResizePointerDown, resizeSelectedLayer };
};
