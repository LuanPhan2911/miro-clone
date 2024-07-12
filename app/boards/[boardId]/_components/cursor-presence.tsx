"use client";
import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";
import { memo } from "react";

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

export const CursorPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  );
});
CursorPresence.displayName = "CursorPresence";
