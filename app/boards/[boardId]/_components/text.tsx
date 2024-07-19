"use client";

import { cn, colorToCss } from "@/lib/utils";
import { LayerType, TextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}
const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});
const calculateFontSize = (width: number, height: number) => {
  const maxFontsize = 96;
  const scaleFactor = 0.3;
  const fontsizeBaseOnWidth = width * scaleFactor;
  const fontsizeBaseOnHeight = height * scaleFactor;
  return Math.min(maxFontsize, fontsizeBaseOnHeight, fontsizeBaseOnWidth);
};
export const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TextProps) => {
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
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <ContentEditable
        html={value}
        onChange={onChangeText}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md",
          font.className
        )}
        style={{
          color: fill ? colorToCss(fill) : "#000",
          fontSize: `${fontSize}px`,
        }}
      />
    </foreignObject>
  );
};
