"use client";

import { Room } from "@/components/room";
import { Canvas, CanvasLoading } from "./_components/canvas";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardIdPage = ({ params }: BoardIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<CanvasLoading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};
export default BoardIdPage;
