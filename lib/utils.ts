import { Camera, Color } from "@/types/canvas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = ["#dc2", "#d97706", "#059669", "#7c3aed", "#db2777"];
export const numberToColor = (number: number) => {
  return COLORS[number % COLORS.length];
};
export const pointerEventToCanvasPoint = (
  e: React.PointerEvent,
  camera: Camera
) => {
  return {
    x: e.clientX - camera.x,
    y: e.clientY - camera.y,
  };
};
export const colorToCss = (color: Color) => {
  const toHex = (n: number) => {
    return n.toString(16).padStart(2, "0");
  };
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
};
