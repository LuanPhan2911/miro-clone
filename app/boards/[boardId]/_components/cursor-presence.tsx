"use client";
import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";
import { memo } from "react";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => {
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}
    </>
  );
};
const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      penDraft: other.presence.penDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  );
  return (
    <>
      {others.map(([key, { penColor, penDraft }]) => {
        if (penDraft) {
          return (
            <Path
              points={penDraft}
              key={key}
              fill={penColor ? colorToCss(penColor) : "#000"}
              x={0}
              y={0}
            />
          );
        }
      })}
    </>
  );
};

export const CursorPresence = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});
CursorPresence.displayName = "CursorPresence";
