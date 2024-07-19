"use client";

import { cn, colorToCss, getContractingColor } from "@/lib/utils";
import { LayerType, NoteLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}
const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});
const calculateFontSize = (width: number, height: number) => {
  const maxFontsize = 96;
  const scaleFactor = 0.15;
  const fontsizeBaseOnWidth = width * scaleFactor;
  const fontsizeBaseOnHeight = height * scaleFactor;
  return Math.min(maxFontsize, fontsizeBaseOnHeight, fontsizeBaseOnWidth);
};
export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: NoteProps) => {
  const { fill, height, width, x, y, value = "Text" } = layer;
  const fontSize = calculateFontSize(width, height);
  const onChangeText = useMutation(({ storage }, e: ContentEditableEvent) => {
    const value = e.target.value;
    const layers = storage.get("layers");
    const selectedLayer = layers.get(id);
    selectedLayer?.set("value", value);
  }, []);
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        background: fill ? colorToCss(fill) : "#000",
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
      className="shadow-sm drop-shadow-xl"
    >
      <ContentEditable
        html={value}
        onChange={onChangeText}
        className={cn(
          "h-full w-full flex items-center justify-center text-center",
          font.className
        )}
        style={{
          color: getContractingColor(fill),
          fontSize: `${fontSize}px`,
        }}
      />
    </foreignObject>
  );
};
