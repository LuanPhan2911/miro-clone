"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-convex-api";
import { api } from "@/convex/_generated/api";
import { AlertModal } from "./alert-modal";
import { Button } from "./ui/button";
import { ReNameBoardTrigger } from "@/app/(dashboard)/_components/board-card/rename-board";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}
export const Actions = ({
  children,
  id,
  title,
  side,
  sideOffset,
}: ActionsProps) => {
  const { isPending, mutate } = useApiMutation(api.boards.destroy);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/boards/${id}`
      );
      toast.success("Copy link success");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const onDelete = async () => {
    try {
      await mutate({ id });
      toast.success("Delete board success");
    } catch (error) {
      toast.error("Delete board failed");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem
          className="cursor-pointer opacity-75 hover:opacity-100"
          onClick={onCopy}
        >
          <Link2 className="w-4 h-4 mr-2" />
          <span>Copy board link</span>
        </DropdownMenuItem>
        <ReNameBoardTrigger id={id} title={title} />
        <AlertModal
          title="Delete board?"
          description="This action will delete board and all of
        its contents."
          onConfirm={onDelete}
          disabled={isPending}
        >
          <Button
            variant={"ghost"}
            className="cursor-pointer opacity-75 hover:opacity-100 w-full flex justify-start p-2"
          >
            <Trash2 className="w-4 h-4 mr-2 text-rose-600" />
            <span>Delete board</span>
          </Button>
        </AlertModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
