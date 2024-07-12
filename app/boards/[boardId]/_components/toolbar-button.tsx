"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
}
export const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
}: ToolbarButtonProps) => {
  return (
    <Hint label={label} side="right">
      <Button
        size={"icon"}
        variant={active ? "boardActive" : "board"}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
