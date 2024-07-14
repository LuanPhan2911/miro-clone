"use client";

import { CursorMode, CursorState } from "@/types/canvas";

import {
  useMutation,
  useSelf,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import { memo, useState } from "react";

interface CursorChatProps {
  cursorState: CursorState;
}
export const CursorChat = memo(({ cursorState }: CursorChatProps) => {
  const { cursor, previousMessage: liveMessage } = useSelf((me) => me.presence);
  const updatePresence = useUpdateMyPresence();
  const [message, setMessage] = useState("");
  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    updatePresence({
      message: e.target.value,
    });
  };

  const onSendMessage = (e: React.KeyboardEvent) => {
    if (!message) {
      return;
    }
    if (e.key === "Enter") {
      updatePresence({
        message: "",
        previousMessage: message,
      });

      setTimeout(() => {
        updatePresence({
          previousMessage: "",
        });
      }, 5000);
      setMessage("");
    }
  };
  if (!cursor || cursorState.mode === CursorMode.Hidden) {
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
      <div className="absolute top-5 left-2 bg-blue-500  px-4 py-2 rounded-2xl">
        {liveMessage ? (
          <div className="w-fit text-white text-sm bg-transparent max-w-40 whitespace-nowrap">
            {liveMessage}
          </div>
        ) : (
          <input
            className="w-40 border-none
      text-sm bg-transparent text-white outline-none placeholder-blue-200 "
            autoFocus
            placeholder="Send message..."
            value={message}
            onChange={onChangeMessage}
            onKeyDown={onSendMessage}
            maxLength={50}
          />
        )}
      </div>
    </div>
  );
});
CursorChat.displayName = "CursorChat";
