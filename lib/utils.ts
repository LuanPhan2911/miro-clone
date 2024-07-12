import { Camera } from "@/types/canvas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = ["#dc26262", "#d97706", "#059669", "#7c3aed", "#db2777"];
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
