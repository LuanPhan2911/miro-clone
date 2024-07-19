import { MAX_LAYER } from "@/app/boards/[boardId]/_components/canvas";
import {
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react/suspense";
import { nanoid } from "nanoid";
import { toast } from "sonner";

export const useInsertLayer = ({
  lastUsedColor,
  setCanvasState,
}: {
  lastUsedColor: Color;
  setCanvasState: (state: CanvasState) => void;
}) => {
  return useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Note
        | LayerType.Rectangle
        | LayerType.Text,
      position: Point
    ) => {
      const liveLayerIds = storage.get("layerIds");
      if (liveLayerIds.length >= MAX_LAYER) {
        toast.warning(`Max layer of board is ${MAX_LAYER}`);
        return;
      }
      const liveLayers = storage.get("layers");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence(
        {
          selection: [layerId],
        },
        {
          addToHistory: true,
        }
      );
      setCanvasState({
        mode: CanvasMode.None,
      });
    },
    [lastUsedColor]
  );
};
