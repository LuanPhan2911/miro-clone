"use client";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButtonTrigger } from "../invite-button";

export const Navbar = () => {
  const { organization } = useOrganization();
  return (
    <div className="flex items-center gap-x-4 p-5">
      <div className="hidden lg:flex flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox:
                "flex items-center w-full max-w-[376px] bg-gray-200 rounded-md",
              organizationSwitcherTrigger:
                "w-full flex justify-between p-[6px]",
              organizationPreviewMainIdentifier: "text-md font-semibold",
            },
          }}
        />
      </div>
      {organization && <InviteButtonTrigger />}
      <UserButton />
    </div>
  );
};
