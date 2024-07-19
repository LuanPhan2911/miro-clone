import { MAX_LAYER } from "@/app/boards/[boardId]/_components/canvas";
import { penPointToPathLayer } from "@/lib/utils";
import { CanvasMode, CanvasState, Color, Point } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react/suspense";
import { nanoid } from "nanoid";

export const useDrawing = ({
  canvasState,
  lastUsedColor,
  setCanvasState,
}: {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  lastUsedColor: Color;
}) => {
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        penDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, current: Point, e: React.PointerEvent) => {
      const { penDraft } = self.presence;
      if (
        penDraft == null ||
        e.buttons !== 1 ||
        canvasState.mode !== CanvasMode.Pencil
      ) {
        return;
      }

      setMyPresence({
        cursor: current,
        penDraft:
          penDraft.length === 1 &&
          penDraft[0][0] === current.x &&
          penDraft[0][1] === current.y
            ? penDraft
            : [...penDraft, [current.x, current.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const { penDraft, penColor } = self.presence;
      const liveLayers = storage.get("layers");
      if (
        penDraft == null ||
        penDraft.length < 2 ||
        liveLayers.size >= MAX_LAYER
      ) {
        setMyPresence({
          penDraft: null,
        });
        return;
      }
      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointToPathLayer(penDraft, lastUsedColor))
      );
      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({
        penDraft: null,
      });
      setCanvasState({
        mode: CanvasMode.Pencil,
      });
    },
    [lastUsedColor]
  );
  return { startDrawing, continueDrawing, insertPath };
};
