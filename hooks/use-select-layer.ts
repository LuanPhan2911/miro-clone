import { pointerEventToCanvasPoint } from "@/lib/utils";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useMutation } from "@liveblocks/react/suspense";

export const useSelectLayer = ({
  canvasState,
  camera,
  setCanvasState,
}: {
  canvasState: CanvasState;
  camera: Camera;
  setCanvasState: (state: CanvasState) => void;
}) => {
  const { pause } = useHistory();
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      ) {
        return;
      }

      pause(); //??
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      if (canvasState.mode !== CanvasMode.Delete) {
        setCanvasState({ mode: CanvasMode.Translating, current: point });
      }
    },
    [setCanvasState, pause, camera, canvasState.mode]
  );
  const unSelectLayer = useMutation(({ setMyPresence, self }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);
  return { onLayerPointerDown, unSelectLayer };
};
