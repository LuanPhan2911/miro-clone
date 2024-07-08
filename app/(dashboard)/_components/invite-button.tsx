"use client";

import { CommonModal } from "@/components/common-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/stores/use-modal";
import { OrganizationProfile, useOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useEffect } from "react";
export const InviteButton = () => {
  const { organization } = useOrganization();
  const { isOpen, type, onClose } = useModal();
  const isOpenModal = isOpen && type === "invite-member";
  useEffect(() => {
    if (!organization) {
      onClose();
    }
  }, [organization, onClose]);
  return (
    <CommonModal
      isOpen={isOpenModal}
      title={"Invite members"}
      className="bg-transparent border-none"
    >
      {organization && <OrganizationProfile routing="virtual" />}
    </CommonModal>
  );
};
export const InviteButtonTrigger = () => {
  const { onOpen } = useModal();
  return (
    <Button variant={"outline"} onClick={() => onOpen("invite-member")}>
      <Plus className="w-4 h-4 mr-2" />
      Invite members
    </Button>
  );
};
