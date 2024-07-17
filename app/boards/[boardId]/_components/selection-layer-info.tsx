"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
interface SelectionLayerInfoProps {
  isShown: boolean;
  setShown: (value: boolean) => void;
}
export const SelectionLayerInfo = ({
  isShown,
  setShown,
}: SelectionLayerInfoProps) => {
  const layerId = useSelf((me) =>
    me.presence.selection.length > 0 ? me.presence.selection[0] : ""
  );
  const selectedLayer = useStorage((root) => root.layers.get(layerId));
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  useEffect(() => {
    if (!selectedLayer) {
      return;
    }
    setX(selectedLayer.x);
    setY(selectedLayer.y);
    setW(selectedLayer.width);
    setH(selectedLayer.height);
  }, [selectedLayer]);
  const updateValue = useMutation(
    (
      { storage },
      e: React.ChangeEvent<HTMLInputElement>,
      type: "x" | "y" | "w" | "h"
    ) => {
      const value = Number(e.target.value);
      const layers = storage.get("layers");
      if (type === "x") {
        setX(value);
        layers.get(layerId)?.set("x", value);
      }
      if (type === "y") {
        setY(value);
        layers.get(layerId)?.set("y", value);
      }
      if (type === "w") {
        setW(value);
        layers.get(layerId)?.set("width", value);
      }
      if (type === "h") {
        setH(value);
        layers.get(layerId)?.set("height", value);
      }
    },
    [layerId]
  );

  if (!isShown || !selectedLayer) {
    return null;
  }

  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] right-4 bg-white shadow-md
    h-[150px] w-[250px] rounded-md p-3
    "
    >
      <Button
        variant={"board"}
        size={"icon"}
        className="absolute top-1 right-1"
        onClick={() => setShown(false)}
      >
        <X />
      </Button>
      <h3 className="text-md font-semibold">Layer Info</h3>
      <div className="grid grid-cols-2 border border-neutral-200 shadow-md mt-2 gap-y-2 py-2">
        <div className="flex justify-between px-2 gap-x-2 items-center">
          <div className="text-sm font-semibold">x</div>
          <input
            className="w-[80px] h-8 border border-neutral-500 rounded-md
            text-center
          "
            value={x}
            type="number"
            onChange={(e) => updateValue(e, "x")}
          />
        </div>
        <div className="flex justify-between px-2 gap-x-2 items-center">
          <div className="text-sm font-semibold">y</div>
          <input
            className="w-[80px] h-8 border border-neutral-500 rounded-md text-center
          "
            value={y}
            type="number"
            onChange={(e) => updateValue(e, "y")}
          />
        </div>
        <div className="flex justify-between px-2 gap-x-2 items-center">
          <div className="text-sm font-semibold">w</div>
          <input
            className="w-[80px] h-8 border border-neutral-500 rounded-md text-center
          "
            value={w}
            type="number"
            onChange={(e) => updateValue(e, "w")}
            min={1}
          />
        </div>
        <div className="flex justify-between px-2 gap-x-2 items-center">
          <div className="text-sm font-semibold">h</div>
          <input
            className="w-[80px] h-8 border border-neutral-500 rounded-md text-center
          "
            value={h}
            type="number"
            onChange={(e) => updateValue(e, "h")}
            min={1}
          />
        </div>
      </div>
    </div>
  );
};
