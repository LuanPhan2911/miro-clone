"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";

import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const isFavorite = searchParams.get("favorite");
  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href={"/"}>
        <div className="flex items-center gap-x-2">
          <Image src={"/logo.png"} alt="Logo" width={60} height={60} />
          <span className={cn("font-semibold text-2xl", font.className)}>
            Board
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: "flex items-center w-full",
            organizationSwitcherTrigger: "w-full flex justify-between p-[6px]",
            organizationPreviewMainIdentifier: "text-lg",
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          asChild
          size={"lg"}
          variant={isFavorite ? "ghost" : "secondary"}
          className="flex justify-start px-2 w-full"
        >
          <Link href={"/"}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team boards
          </Link>
        </Button>
        <Button
          asChild
          size={"lg"}
          variant={isFavorite ? "secondary" : "ghost"}
          className="flex justify-start px-2 w-full"
        >
          <Link href={{ href: "/", query: { favorite: true } }}>
            <Star className="h-4 w-4 mr-2" />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
