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
} from "@/types/canvas";
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { numberToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { toast } from "sonner";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";

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
  const [lastUsedColor, setUsedLastColor] = useState<Color>({
    b: 255,
    g: 255,
    r: 255,
  });

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
      if (liveLayerIds.length > MAX_LAYER) {
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
  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      historyResume();
    },
    [camera, canvasState, historyResume, insertLayer]
  );
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => {
      return {
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      };
    });
  }, []);
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);

      setMyPresence({
        cursor: current,
      });
    },
    []
  );
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);
  const onPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      ) {
        return;
      }

      historyPause();
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, historyPause, camera, canvasState.mode]
  );

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

      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
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
                onLayerPointerDown={onPointerDown}
                selectionColor={layerIdsToColorSelection[layerId]}
              />
            );
          })}
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
