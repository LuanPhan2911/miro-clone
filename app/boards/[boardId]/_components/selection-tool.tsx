"use client";

import { useSelectionBound } from "@/hooks/use-selection-box";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayer } from "@/hooks/use-delete-layer";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBackIcon, Trash2 } from "lucide-react";

interface SelectionToolProps {
  camera: Camera;
  hidden?: boolean;
  setLastUsedColor: (color: Color) => void;
}
export const SelectionTool = memo(
  ({ camera, hidden, setLastUsedColor }: SelectionToolProps) => {
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
    const sendToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        liveLayerIds.forEach((layerId, index) => {
          if (selection.includes(layerId)) {
            indices.push(index);
          }
        });
        indices.forEach((idx, index) => {
          liveLayerIds.move(idx, index);
        });
      },
      [selection]
    );
    const bringToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        liveLayerIds.forEach((layerId, index) => {
          if (selection.includes(layerId)) {
            indices.push(index);
          }
        });
        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            liveLayerIds.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    if (!selectionBounds || hidden) {
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
        <div className="flex flex-col gap-y-0.5 pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Bring to front">
            <Button variant={"board"} size={"icon"} onClick={bringToFront}>
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Send to back">
            <Button variant={"board"} size={"icon"} onClick={sendToBack}>
              <SendToBackIcon />
            </Button>
          </Hint>
        </div>
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
