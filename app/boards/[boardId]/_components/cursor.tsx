"use client";
import { numberToColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";
interface CursorProps {
  connectionId: number;
}
export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user.info);
  const { cursor, previousMessage, message, ping } = useOther(
    connectionId,
    (user) => user.presence
  );
  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "Teammate";
  if (ping) {
    return (
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
          <div
            className="animate-ping w-[60px] h-[60px] rounded-full"
            style={{
              background: numberToColor(connectionId),
            }}
          >
            {" "}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="pointer-events-none absolute top-0 left-0"
    >
      <MousePointer2
        className="w-5 h-5"
        style={{
          fill: numberToColor(connectionId),
          color: numberToColor(connectionId),
        }}
      />
      <div
        className="absolute w-fit flex flex-col gap-y-1 max-w-60 left-0 px-1.5 py-0.5 rounded-md text-white"
        style={{
          backgroundColor: numberToColor(connectionId),
        }}
      >
        <div className="text-sm font-semibold whitespace-nowrap">{name}</div>
        {message && <div className="text-sm">{message}</div>}
        {previousMessage && <div className="text-sm">{previousMessage}</div>}
      </div>
    </div>
  );
});
Cursor.displayName = "Cursor";
