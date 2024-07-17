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
    <div
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div className="animate-ping w-[60px] h-[60px] bg-rose-500 rounded-full"></div>
      </div>
    </div>
  );
});
CursorPing.displayName = "CursorPing";
