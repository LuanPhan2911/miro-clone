"use client";

import { CommonModal, CommonModalTrigger } from "@/components/common-modal";
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
    <CommonModal isOpen={isOpenModal} title={"Invite members"}>
      {organization && <OrganizationProfile routing="virtual" />}
    </CommonModal>
  );
};
export const InviteButtonTrigger = () => {
  return (
    <CommonModalTrigger type="invite-member">
      <Button variant={"outline"}>
        <Plus className="w-4 h-4 mr-2" />
        Invite members
      </Button>
    </CommonModalTrigger>
  );
};
