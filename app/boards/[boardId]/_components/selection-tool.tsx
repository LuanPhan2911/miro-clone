"use client";

import { useSelectionBound } from "@/hooks/use-selection-box";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayer } from "@/hooks/use-delete-layer";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SelectionToolProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}
export const SelectionTool = memo(
  ({ camera, setLastUsedColor }: SelectionToolProps) => {
    const selection = useSelf((me) => me.presence.selection);
    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        setLastUsedColor(fill);
        const liveLayers = storage.get("layers");
        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );
    const selectionBounds = useSelectionBound();
    const deleteLayer = useDeleteLayer();

    if (!selectionBounds) {
      return null;
    }
    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;
    return (
      <div
        className="absolute p-3 rounded-md bg-white shadow-md
    border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        }}
      >
        <ColorPicker onChange={(color) => setFill(color)} />
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant={"board"} size={"icon"} onClick={deleteLayer}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);
SelectionTool.displayName = "SelectionTool";
