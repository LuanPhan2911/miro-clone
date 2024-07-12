import { Skeleton } from "@/components/ui/skeleton";
import { ToolbarButton } from "./toolbar-button";
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo,
  Square,
  StickyNote,
  Type,
  Undo,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  redo: () => void;
  undo: () => void;
  canRedo: boolean;
  canUndo: boolean;
}
export const Toolbar = ({
  canRedo,
  canUndo,
  canvasState,
  redo,
  setCanvasState,
  undo,
}: ToolbarProps) => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%]
  left-2 flex flex-col gap-y-4"
    >
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
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
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
        <ToolbarButton
          label="Redo"
          icon={Redo}
          onClick={() => {}}
          disabled={!canRedo}
        />
        <ToolbarButton
          label="Undo"
          icon={Undo}
          onClick={() => {}}
          disabled={!canUndo}
        />
      </div>
    </div>
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
