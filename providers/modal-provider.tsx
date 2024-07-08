"use client";
import { RenameBoardModal } from "@/app/(dashboard)/_components/board-card/rename-board";
import { InviteButton } from "@/app/(dashboard)/_components/invite-button";
import { NewOrg } from "@/app/(dashboard)/_components/sidebar/new-org";
import { useIsClient } from "usehooks-ts";

export const ModalProvider = () => {
  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }
  return (
    <>
      <NewOrg />
      <InviteButton />
      <RenameBoardModal />
    </>
  );
};
