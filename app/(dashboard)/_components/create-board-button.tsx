"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateBoardButton = ({ label }: { label: string }) => {
  const { organization } = useOrganization();
  const { mutate, isPending } = useApiMutation(api.boards.create);
  const router = useRouter();
  const onClick = async () => {
    if (!organization) {
      return;
    }
    try {
      const boardId = await mutate({
        orgId: organization.id,
        title: "Untitled",
      });
      toast.success("Created board!");
      // router.push(`/boards/${boardId}`)
    } catch (error) {
      toast.error("Fail to create board");
    }
  };
  return (
    <Button onClick={onClick} disabled={isPending}>
      {label}
    </Button>
  );
};
