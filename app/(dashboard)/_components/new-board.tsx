"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-convex-api";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewBoardTriggerProps {
  disabled?: boolean;
  orgId: string;
}

export const NewBoardTrigger = ({ disabled, orgId }: NewBoardTriggerProps) => {
  const { isPending, mutate } = useApiMutation(api.boards.create);
  const router = useRouter();
  const onCreate = async () => {
    try {
      const boardId = await mutate({
        orgId: orgId,
        title: "Untitled",
      });
      toast.success("Create board!");
      router.push(`/boards/${boardId}`);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <button
      disabled={disabled || isPending}
      onClick={onCreate}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col justify-center items-center"
      )}
    >
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">New board</p>
    </button>
  );
};
