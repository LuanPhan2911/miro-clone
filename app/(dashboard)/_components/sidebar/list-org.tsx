"use client";

import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import Image from "next/image";

export const ListOrg = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (userMemberships.data?.length === 0) {
    return null;
  }
  return (
    <div className="space-y-4">
      {userMemberships.data?.map(({ organization }) => {
        return (
          <OrgItem
            key={organization.id}
            id={organization.id}
            name={organization.name}
            imageUrl={organization.imageUrl}
          />
        );
      })}
    </div>
  );
};
interface OrgItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
const OrgItem = ({ id, name, imageUrl }: OrgItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();
  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) {
      return null;
    }
    setActive({ organization: id });
  };
  return (
    <Hint label={name} side="right">
      <div className="aspect-square relative h-10 w-10">
        <Image
          onClick={onClick}
          alt={name}
          src={imageUrl}
          fill
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
        />
      </div>
    </Hint>
  );
};
