"use client";

import { CommonModalTrigger } from "@/components/common-modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"/element.svg"} alt="Empty" width={200} height={200} />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Create an organization to get started
      </p>
      <div className="mt-6">
        <CommonModalTrigger type="new-org">
          <Button size={"lg"}>Create organization</Button>
        </CommonModalTrigger>
      </div>
    </div>
  );
};
