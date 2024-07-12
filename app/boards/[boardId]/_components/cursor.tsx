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
  const cursor = useOther(connectionId, (user) => user.presence.cursor);
  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "Teammate";

  return (
    <foreignObject
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      height={50}
      width={100}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="w-5 h-5"
        style={{
          fill: numberToColor(connectionId),
          color: numberToColor(connectionId),
        }}
      />
      <div
        className="absolute left-0 px-1.5 py-0.5 rounded-md text-xs 
      text-white font-semibold truncate"
        style={{
          backgroundColor: numberToColor(connectionId),
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
});
Cursor.displayName = "Cursor";
