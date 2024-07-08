"use client";

import { CommonModal } from "@/components/common-modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";

import { useApiMutation } from "@/hooks/use-convex-api";
import { useModal } from "@/stores/use-modal";
import { DialogClose } from "@radix-ui/react-dialog";
import { Edit2 } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
interface ReNameBoardTriggerProps {
  id: string;
  title: string;
}

export const ReNameBoardTrigger = ({ id, title }: ReNameBoardTriggerProps) => {
  const { onOpen } = useModal();
  return (
    <DropdownMenuItem
      onClick={() => onOpen("rename-board", { board: { id, title } })}
      className="cursor-pointer opacity-75 hover:opacity-100 w-full flex justify-start p-2"
    >
      <Edit2 className="w-4 h-4 mr-2 text-yellow-400" />
      <span>Edit board</span>
    </DropdownMenuItem>
  );
};
export const RenameBoardModal = () => {
  const { isOpen, type, data } = useModal();
  const isOpenModal = isOpen && type === "rename-board";

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const { isPending, mutate } = useApiMutation(api.boards.update);
  const { onClose } = useModal();
  useEffect(() => {
    if (data.board?.title) {
      setTitle(data.board.title);
    }
    if (data.board?.id) {
      setId(data.board.id);
    }
  }, [data.board]);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await mutate({ id, title });
      toast.success("Updated title");
      onClose();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <CommonModal
      isOpen={isOpenModal}
      title="Rename board"
      description="Enter a new title for this board."
    >
      <form className="space-y-4 w-[400px]" onSubmit={handleSubmit}>
        <Input
          required
          disabled={isPending}
          maxLength={60}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Board title"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"} type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </CommonModal>
  );
};
