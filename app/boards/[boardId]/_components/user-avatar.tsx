"use client";

import { Hint } from "@/components/hint";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface UserAvatarProps {
  name: string;
  src?: string;
  fallback: string;
  borderColor: string;
}
export const UserAvatar = ({
  borderColor,
  fallback,
  name,
  src,
}: UserAvatarProps) => {
  return (
    <Hint label={name} side="bottom">
      <Avatar
        className="border-2 h-12 w-12 flex items-center justify-center"
        style={{ borderColor }}
      >
        <AvatarImage src={src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </Hint>
  );
};
