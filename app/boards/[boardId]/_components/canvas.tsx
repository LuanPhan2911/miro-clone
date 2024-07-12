"use client";

import { Loader } from "lucide-react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useMutation } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const { redo, undo, canRedo, canUndo } = useHistory();
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

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
      >
        <g>
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
