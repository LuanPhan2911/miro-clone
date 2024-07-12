"use client";
import { Actions } from "@/components/actions";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/use-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
const font = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});
interface InfoProps {
  boardId: string;
}
const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};
export const Info = ({ boardId }: InfoProps) => {
  const data = useQuery(api.boards.getOne, { id: boardId as Id<"boards"> });
  const { onOpen } = useModal();
  if (!data) {
    return <Info.Skeleton />;
  }

  const handleOpenModal = () => {
    onOpen("rename-board", {
      board: {
        id: boardId,
        title: data.title,
      },
    });
  };
  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 
    h-12 flex items-center shadow-md"
    >
      <Hint label="Go to board" side="bottom">
        <Button variant={"board"} className="px-2" asChild>
          <Link href={"/"}>
            <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Board
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom">
        <Button
          variant={"board"}
          className="text-base font-normal px-2"
          onClick={handleOpenModal}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions id={boardId} title={data.title} side="bottom">
        <div className="px-2">
          <Hint label="Main menu" side="right">
            <Button size={"icon"} variant={"board"}>
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};
Info.Skeleton = function InfoSkeleton() {
  return (
    <div
      className="absolute top-2 left-2 rounded-md 
    h-12 flex items-center shadow-md w-[300px]"
    >
      <Skeleton className="h-full w-full" />
    </div>
  );
};
