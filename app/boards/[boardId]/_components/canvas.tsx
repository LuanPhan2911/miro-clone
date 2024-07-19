"use client";

import { Loader } from "lucide-react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  CursorMode,
  CursorState,
} from "@/types/canvas";
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import {
  colorToCss,
  numberToColor,
  pointerEventToCanvasPoint,
} from "@/lib/utils";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTool } from "./selection-tool";
import { useDeleteLayer } from "@/hooks/use-delete-layer";
import { CursorChat } from "./cursor-chat";
import { SelectionLayerInfo } from "./selection-layer-info";
import { CursorPing } from "./cursor-ping";
import { SelectionNetBox } from "./selection-net-box";
import { Path } from "./path";
import { useDisabledScrollBounce } from "@/hooks/use-disabled-scroll-bounce";
import { useInsertLayer } from "@/hooks/use-insert-layer";
import { useResizeLayer } from "@/hooks/use-resize-layer";
import { useMultiSelectLayer } from "@/hooks/use-multi-select-layer";
import { useDrawing } from "@/hooks/use-drawing";
import { useSelectLayer } from "@/hooks/use-select-layer";
import { useTranslateLayer } from "@/hooks/use-translate-layer";
import { useCamera } from "@/hooks/use-camera";
export const MAX_LAYER = 100;
interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const penDraft = useSelf((me) => me.presence.penDraft);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const {
    redo,
    undo,
    canRedo,
    canUndo,
    clear: historyClear,
    resume: historyResume,
    pause: historyPause,
  } = useHistory();
  useDisabledScrollBounce();

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    b: 0,
    g: 0,
    r: 0,
  });
  const [showSelectionLayerInfo, setShowSelectionLayerInfo] = useState(true);
  //Pointer move and Pointer leave

  const insertLayer = useInsertLayer({ lastUsedColor, setCanvasState });
  const deleteLayer = useDeleteLayer();
  const { resizeSelectedLayer, onResizePointerDown } = useResizeLayer({
    canvasState,
    setCanvasState,
  });

  const { startMultiSelect, updateSelectionNet } = useMultiSelectLayer({
    setCanvasState,
  });
  const { continueDrawing, startDrawing, insertPath } = useDrawing({
    canvasState,
    lastUsedColor,
    setCanvasState,
  });
  const { onLayerPointerDown, unSelectLayer } = useSelectLayer({
    camera,
    canvasState,
    setCanvasState,
  });
  const { translateSelectedLayer } = useTranslateLayer({
    canvasState,
    setCanvasState,
  });
  const { translateCamera } = useCamera({ camera, setCamera });
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({ mode: CursorMode.Chat });
      }
      if (e.key === "Escape") {
        setCursorState({ mode: CursorMode.Hidden });
      }
      if (e.key === "Delete") {
        deleteLayer();
      }
      if (e.key === "ArrowUp") {
        setCamera((prev) => {
          return {
            ...prev,
            y: prev.y + 16,
          };
        });
      }
      if (e.key === "ArrowDown") {
        setCamera((prev) => {
          return {
            ...prev,
            y: prev.y - 16,
          };
        });
      }
      if (e.key === "ArrowLeft") {
        setCamera((prev) => {
          return {
            ...prev,
            x: prev.x + 16,
          };
        });
      }
      if (e.key === "ArrowRight") {
        setCamera((prev) => {
          return {
            ...prev,
            x: prev.x - 16,
          };
        });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayer]);

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Delete) {
        deleteLayer();
      } else if (
        (canvasState.mode === CanvasMode.Pressing &&
          canvasState.type === "select") ||
        canvasState.mode === CanvasMode.None
      ) {
        //Unselect
        unSelectLayer();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else if (
        canvasState.mode === CanvasMode.Pressing &&
        canvasState.type === "hand"
      ) {
        setCanvasState({ mode: CanvasMode.Hand });
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      historyResume(); //??
    },
    [
      camera,
      canvasState,
      historyResume,
      insertLayer,
      deleteLayer,
      insertLayer,
      unSelectLayer,
      insertPath,
    ]
  );
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({
        cursor: current,
      });
      if (canvasState.mode === CanvasMode.SelectNet) {
        updateSelectionNet(canvasState.origin, current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pressing) {
        if (canvasState.type === "hand") {
          translateCamera(canvasState.origin, current);
        } else if (canvasState.type === "select") {
          startMultiSelect(canvasState.origin, current);
        }
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
    },
    [
      canvasState,
      camera,
      resizeSelectedLayer,
      continueDrawing,
      translateSelectedLayer,
      translateCamera,
      startMultiSelect,
      updateSelectionNet,
    ]
  );
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Delete
      ) {
        return;
      } else if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      const type = canvasState.mode === CanvasMode.Hand ? "hand" : "select";
      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
        type: type,
      });
    },
    [camera, canvasState, setCanvasState, startDrawing]
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
  const isHand =
    canvasState.mode === CanvasMode.Hand ||
    (canvasState.mode === CanvasMode.Pressing && canvasState.type === "hand");
  return (
    <main
      className="h-full w-full bg-neutral-100 touch-none relative"
      style={{
        cursor: `${isHand ? "pointer" : "url(/cursor.svg) 0 0, auto"}`,
      }}
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        cursorState={cursorState}
        showSelectionLayerInfo={showSelectionLayerInfo}
        setCanvasState={setCanvasState}
        setCursorState={setCursorState}
        setShowSelectionLayerInfo={setShowSelectionLayerInfo}
        redo={redo}
        undo={undo}
        canRedo={canRedo()}
        canUndo={canUndo()}
        clearHistory={historyClear}
        lastUseColor={lastUsedColor}
        setLastUsedColor={setLastUsedColor}
        isClear={layerIds.length === 0}
      />
      <SelectionTool
        camera={camera}
        hidden={canvasState.mode === CanvasMode.Delete}
        setLastUsedColor={setLastUsedColor}
      />
      <SelectionLayerInfo
        isShown={showSelectionLayerInfo}
        setShown={setShowSelectionLayerInfo}
      />

      <CursorPing cursorState={cursorState} />

      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => {
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
          <SelectionNetBox canvasState={canvasState} />
          <CursorChat cursorState={cursorState} />
        </g>

        <CursorPresence />
        {penDraft != null && penDraft.length > 0 && (
          <Path
            points={penDraft}
            fill={colorToCss(lastUsedColor)}
            x={0}
            y={0}
          />
        )}
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
