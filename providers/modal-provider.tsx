import { InviteButton } from "@/app/(dashboard)/_components/invite-button";
import { NewOrg } from "@/app/(dashboard)/_components/sidebar/new-org";

export const ModalProvider = () => {
  return (
    <>
      <NewOrg />
      <InviteButton />
    </>
  );
};
