"use client";

import { CommonModal } from "@/components/common-modal";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-convex-api";
import { useModal } from "@/stores/use-modal";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Title is required!",
    })
    .max(60, {
      message: "The length of title is no longer than 60 characters!",
    }),
});
export const RenameBoardModal = () => {
  const { isOpen, type, data } = useModal();
  const isOpenModal = isOpen && type === "rename-board";
  const [id, setId] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isPending, mutate } = useApiMutation(api.boards.update);
  const { onClose } = useModal();
  useEffect(() => {
    if (data.board?.title) {
      form.setValue("title", data.board.title);
    }
    if (data.board?.id) {
      setId(data.board.id);
    }
  }, [data.board, form]);
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await mutate({ id, title: value.title });
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[400px]"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title of board" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
      </Form>
    </CommonModal>
  );
};
