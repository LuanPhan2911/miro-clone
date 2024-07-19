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
      <foreignObject
        width={200}
        height={200}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        className="relative drop-shadow-sm"
      >
        <div className="absolute left-0 top-0 -translate-x-[50%] -translate-y-[50%]">
          <div
            className="animate-ping w-[60px] h-[60px] rounded-full"
            style={{
              background: numberToColor(connectionId),
            }}
          >
            {" "}
          </div>
        </div>
      </foreignObject>
    );
  }
  return (
    <foreignObject
      width={200}
      height={200}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="relative drop-shadow-sm"
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
    </foreignObject>
  );
});
Cursor.displayName = "Cursor";
