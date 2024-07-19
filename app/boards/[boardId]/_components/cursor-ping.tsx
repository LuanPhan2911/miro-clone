"use client";

import { CursorMode, CursorState } from "@/types/canvas";
import { useSelf } from "@liveblocks/react/suspense";
import { memo } from "react";
interface CursorPingProps {
  cursorState: CursorState;
}
export const CursorPing = memo(({ cursorState }: CursorPingProps) => {
  const cursor = useSelf((me) => me.presence.cursor);

  if (!cursor || cursorState.mode !== CursorMode.Ping) {
    return null;
  }
  const { x, y } = cursor;

  return (
    <foreignObject
      width={100}
      height={100}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="relative drop-shadow-sm"
    >
      <div className="absolute left-0 top-0 -translate-x-[50%] -translate-y-[50%]">
        <div className="animate-ping w-[60px] h-[60px] bg-rose-500 rounded-full"></div>
      </div>
    </foreignObject>
  );
});
CursorPing.displayName = "CursorPing";
