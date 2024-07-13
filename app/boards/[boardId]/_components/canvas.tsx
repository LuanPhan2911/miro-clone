"use client";

import { Loader } from "lucide-react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import {
  numberToColor,
  pointerEventToCanvasPoint,
  resizeBound,
} from "@/lib/utils";
import { toast } from "sonner";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTool } from "./selection-tool";
import { useDeleteLayer } from "@/hooks/use-delete-layer";
const MAX_LAYER = 100;
interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  const layersId = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const {
    redo,
    undo,
    canRedo,
    canUndo,
    resume: historyResume,
    pause: historyPause,
  } = useHistory();
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    b: 255,
    g: 255,
    r: 255,
  });
  //Pointer move and Pointer leave

  const insertLayer = useMutation(
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
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );
  const deleteLayer = useDeleteLayer();
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
  const onPointerUp = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.None
      ) {
        //Unselect
        unSelectLayer();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      historyResume(); //??
    },
    [camera, canvasState, historyResume, insertLayer]
  );
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({
        cursor: current,
      });

      if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      }
    },
    [canvasState, camera, resizeSelectedLayer]
  );
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }
      const point = pointerEventToCanvasPoint(e, camera);
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState, setCanvasState]
  );
  //Pointer move and Pointer leave
  //Pointer Scroll
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => {
      return {
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      };
    });
  }, []);
  //Pointer Scroll
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete") {
      deleteLayer();
    }
  };
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      ) {
        return;
      }

      historyPause(); //??
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, historyPause, camera, canvasState.mode]
  );
  const onResizePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      historyPause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [historyPause]
  );
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
  const unSelectLayer = useMutation(({ setMyPresence, self }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const selections = useOthersMapped((other) => other.presence.selection);
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColor: Record<string, string> = {};
    selections.forEach(([connectionId, selection]) => {
      selection.forEach((layerId) => {
        layerIdsToColor[layerId] = numberToColor(connectionId);
      });
    });
    return layerIdsToColor;
  }, [selections]);

  return (
    <main className="h-full w-full bg-neutral-100 touch-none relative">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        redo={redo}
        undo={undo}
        canRedo={canRedo()}
        canUndo={canUndo()}
      />
      <SelectionTool camera={camera} setLastUsedColor={setLastUsedColor} />

      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        tabIndex={-1}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layersId.map((layerId) => {
            return (
              <LayerPreview
                key={layerId}
                id={layerId}
                onLayerPointerDown={onLayerPointerDown}
                selectionColor={layerIdsToColorSelection[layerId]}
              />
            );
          })}
          <SelectionBox onResizePointerDown={onResizePointerDown} />
          <CursorPresence />
        </g>
      </svg>
    </main>
  );
};
Canvas.Skeleton = function CanvasSkeleton() {
  return (
    <main
      className="h-full w-full bg-neutral-100 touch-none relative 
    flex flex-col items-center justify-center"
    >
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
      <Loader className="w-6 h-6 relative text-muted-foreground animate-spin" />
      <div className="text-muted-foreground text-sm font-semibold mt-4">
        Loading ...
      </div>
      <Button asChild>
        <Link href={"/"} className="mt-4 text-sm">
          Go to board
        </Link>
      </Button>
    </main>
  );
};
