import { findIntersectingLayersWithRectangle } from "@/lib/utils";
import { CanvasMode, CanvasState, Point } from "@/types/canvas";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { useCallback } from "react";

export const useMultiSelectLayer = ({
  setCanvasState,
}: {
  setCanvasState: (state: CanvasState) => void;
}) => {
  const layerIds = useStorage((root) => root.layerIds);
  const startMultiSelect = useCallback(
    (origin: Point, current: Point) => {
      if (Math.abs(current.x - origin.y) + Math.abs(current.y - origin.y) > 5) {
        setCanvasState({
          mode: CanvasMode.SelectNet,
          origin,
          current,
        });
      }
    },
    [setCanvasState]
  );
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, origin: Point, current: Point) => {
      const layers = storage.get("layers").toImmutable();

      setCanvasState({
        mode: CanvasMode.SelectNet,
        origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({
        selection: ids,
      });
    },
    [layerIds]
  );
  return { startMultiSelect, updateSelectionNet };
};
