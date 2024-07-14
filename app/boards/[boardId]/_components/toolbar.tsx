"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolbarButton } from "./toolbar-button";
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo,
  Save,
  Square,
  StickyNote,
  Type,
  Undo,
  EraserIcon,
  MessageCircle,
  MessageSquareMore,
  Trash2,
} from "lucide-react";
import {
  CanvasMode,
  CanvasState,
  Color,
  CursorMode,
  CursorState,
  LayerType,
} from "@/types/canvas";
import { ToolbarColorButton } from "./toolbar-color-button";
import { AlertModal } from "@/components/alert-modal";
import { useEffect, useState } from "react";
import { useDeleteAllLayer } from "@/hooks/use-delete-layer";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  canvasState: CanvasState;
  cursorState: CursorState;
  setCanvasState: (state: CanvasState) => void;
  redo: () => void;
  undo: () => void;
  canRedo: boolean;
  canUndo: boolean;
  isClear: boolean;
  lastUseColor: Color;
  clearHistory: () => void;
  setLastUsedColor: (color: Color) => void;
  setCursorState: (state: CursorState) => void;
}
export const Toolbar = ({
  canRedo,
  canUndo,
  canvasState,
  cursorState,
  lastUseColor,
  isClear,
  setLastUsedColor,
  redo,
  setCanvasState,
  undo,
  clearHistory,
  setCursorState,
}: ToolbarProps) => {
  const [isRedo, setRedo] = useState(false);
  const [isUndo, setUndo] = useState(false);
  const deleteAllLayer = useDeleteAllLayer();

  useEffect(() => {
    setRedo(() => canRedo);
    setUndo(() => canUndo);
  }, [canRedo, canUndo]);
  const handleSave = () => {
    clearHistory();
    setRedo(false);
    setUndo(false);
  };
  const toggleCursorChat = () => {
    if (cursorState.mode === CursorMode.Hidden) {
      setCursorState({ mode: CursorMode.Chat });
    } else {
      setCursorState({ mode: CursorMode.Hidden });
    }
  };

  return (
    <>
      <div
        className="absolute top-[50%] -translate-y-[50%]
  left-2 flex flex-col gap-y-4"
      >
        <div
          className="bg-white rounded-md p-1.5 flex
      flex-wrap max-w-[100px]
       gap-2 items-center shadow-md"
        >
          <ToolbarButton
            label="Select"
            icon={MousePointer2}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.None,
              })
            }
            active={
              canvasState.mode === CanvasMode.None ||
              canvasState.mode === CanvasMode.Pressing ||
              canvasState.mode === CanvasMode.SelectNet ||
              canvasState.mode === CanvasMode.Translating ||
              canvasState.mode === CanvasMode.Resizing
            }
          />
          <ToolbarButton
            label="Text"
            icon={Type}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Text,
              })
            }
            active={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Text
            }
          />
          <ToolbarButton
            label="Note"
            icon={StickyNote}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Note,
              })
            }
            active={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Note
            }
          />
          <ToolbarButton
            label="Rectangle"
            icon={Square}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
            active={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Rectangle
            }
          />
          <ToolbarButton
            label="Circle"
            icon={Circle}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
            active={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Ellipse
            }
          />
          <ToolbarButton
            label="Pen"
            icon={Pencil}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Pencil,
              })
            }
            active={canvasState.mode === CanvasMode.Pencil}
          />
          <ToolbarButton
            label="Delete"
            icon={EraserIcon}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Delete,
              })
            }
            active={canvasState.mode === CanvasMode.Delete}
          />
          <ToolbarColorButton onClick={setLastUsedColor} color={lastUseColor} />
        </div>
        <div className="bg-white w-fit rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
          <AlertModal
            title="Save board"
            description="After save the board, you cannot redo or undo the board."
            onConfirm={handleSave}
          >
            <Button
              size={"icon"}
              variant={"board"}
              disabled={!isRedo && !isUndo}
            >
              <Save />
            </Button>
          </AlertModal>

          <ToolbarButton
            label="Redo"
            icon={Redo}
            onClick={() => redo()}
            disabled={!isRedo}
          />
          <ToolbarButton
            label="Undo"
            icon={Undo}
            onClick={() => undo()}
            disabled={!isUndo}
          />
        </div>
        <div className="bg-rose-200 w-fit rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
          <AlertModal
            title="Clear the board"
            description="Delete all layer in the board!"
            onConfirm={() => deleteAllLayer()}
          >
            <Button size={"icon"} variant={"board"} disabled={isClear}>
              <Trash2 />
            </Button>
          </AlertModal>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-x-2">
        <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-2 shadow-md">
          <ToolbarButton
            icon={MessageCircle}
            label="Chats"
            onClick={toggleCursorChat}
          />
          <ToolbarButton
            icon={MessageSquareMore}
            label="Comments"
            onClick={() => {}}
          />
        </div>
      </div>
    </>
  );
};
Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%]
  left-2 flex flex-col h-[360px] w-[52px]"
    >
      <Skeleton className="h-full w-full" />
    </div>
  );
};
