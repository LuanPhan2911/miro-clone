"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Color } from "@/types/canvas";
import { ColorPicker } from "./color-picker";
import { colorToCss } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
interface ToolbarColorButtonProps {
  color: Color;
  onClick: (color: Color) => void;
}
export const ToolbarColorButton = ({
  color,
  onClick,
}: ToolbarColorButtonProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Hint label="Pick color" side="bottom">
          <Button
            variant={"board"}
            className="hover:opacity-75 transition flex justify-center items-center ring-0 border-0"
            size={"icon"}
          >
            <div
              className="w-8 h-8 rounded-md border border-neutral-300 "
              style={{
                backgroundColor: colorToCss(color),
              }}
            ></div>
          </Button>
        </Hint>
      </HoverCardTrigger>
      <HoverCardContent side="right" sideOffset={20}>
        <ColorPicker onChange={onClick} />
      </HoverCardContent>
    </HoverCard>
  );
};
