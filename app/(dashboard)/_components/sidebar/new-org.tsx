"use client";

import { CommonModal, CommonModalTrigger } from "@/components/common-modal";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useModal } from "@/stores/use-modal";
import { CreateOrganization } from "@clerk/nextjs";

import { Plus } from "lucide-react";

export const NewOrgButton = () => {
  return (
    <CommonModalTrigger type="new-org">
      <Hint label="Create Organization" side="right">
        <Button size={"icon"} className="bg-white/15">
          <Plus className="w-6 h-6" />
        </Button>
      </Hint>
    </CommonModalTrigger>
  );
};
export const NewOrg = () => {
  const { isOpen, type } = useModal();
  const isOpenModal = isOpen && type === "new-org";
  return (
    <CommonModal
      isOpen={isOpenModal}
      title={<h3 className="text-xl font-semibold">Create Organization</h3>}
    >
      <CreateOrganization
        skipInvitationScreen
        routing="virtual"
        appearance={{
          elements: {
            cardBox: {
              boxShadow: "none",
            },
            headerTitle: "hidden",
            footer: "hidden",
          },
        }}
      />
    </CommonModal>
  );
};
