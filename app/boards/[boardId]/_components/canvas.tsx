"use client";

import { Loader } from "lucide-react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@liveblocks/react/suspense";
interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className="h-full w-full bg-neutral-100 touch-none relative">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};
export const CanvasLoading = () => {
  return (
    <main
      className="h-full w-full bg-neutral-100 touch-none relative 
    flex items-center justify-center"
    >
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
      <Loader className="w-6 h-6 relative text-muted-foreground animate-spin" />
    </main>
  );
};
