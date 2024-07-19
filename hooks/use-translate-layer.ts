import { CanvasMode, CanvasState, Point } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";

export const useTranslateLayer = ({
  canvasState,
  setCanvasState,
}: {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
}) => {
  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };
      const liveLayers = storage.get("layers");
      for (let id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [canvasState]
  );
  return { translateSelectedLayer };
};
