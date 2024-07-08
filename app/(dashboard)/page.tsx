"use client";

import { useOrganization } from "@clerk/nextjs";
import { EmptyState } from "./_components/empty-state";
import { BoardList, BoardListSkeleton } from "./_components/board-list";
import { Suspense } from "react";

interface Props {
  searchParams: {
    search?: string;
    favorite?: string;
  };
}

export default function DashboardPage({ searchParams }: Props) {
  const { organization } = useOrganization();
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyState />
      ) : (
        <BoardList orgId={organization?.id} query={searchParams} />
      )}
    </div>
  );
}
