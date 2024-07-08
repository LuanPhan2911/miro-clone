"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface FooterProps {
  isFavorite: boolean;
  title: string;
  authorLabel: string;
  createdLabel: string;
  disabled: boolean;
  onClick: () => void;
}

export const Footer = ({
  authorLabel,
  createdLabel,
  disabled,
  isFavorite,
  onClick,
  title,
}: FooterProps) => {
  return (
    <div className="relative p-3 bg-white">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p
        className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity
    text-muted-foreground truncate"
      >
        {authorLabel}, {createdLabel}
      </p>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn("w-4 h-4", isFavorite && "fill-blue-600 text-blue-600")}
        />
      </button>
    </div>
  );
};
