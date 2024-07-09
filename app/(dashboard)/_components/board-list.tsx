"use client";
import Image from "next/image";
import { CreateBoardButton } from "./create-board-button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BoardCard, BoardCardSkeleton } from "./board-card";
import { NewBoardTrigger } from "./new-board";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorite?: string;
  };
}

export const EmptyBoard = ({
  src,
  title,
  subtitle,
  action,
}: {
  src: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <Image src={src} width={140} height={140} alt="Nothing" />
      <h2 className="text-2xl font-semibold mt-6">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export const BoardList = ({ query, orgId }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId: orgId,
  });
  const title = query.favorite ? "Favorite boards" : "Team boards";
  const loading = data === undefined;
  if (loading) {
    return <BoardListSkeleton />;
  }
  if (!data?.length && query.search) {
    return (
      <EmptyBoard
        src="/nothing.png"
        title="No results found!"
        subtitle="Try searching something else!"
      />
    );
  }
  if (!data?.length && query.favorite) {
    return (
      <EmptyBoard
        src="/nofavorite.png"
        title="No favorites boards"
        subtitle="Try favoriting boards"
      />
    );
  }
  if (!data?.length) {
    return (
      <EmptyBoard
        src="/noboard.png"
        title="No boards"
        subtitle="Try creating a new board for your organization"
        action={<CreateBoardButton label="Create a board" />}
      />
    );
  }
  return (
    <div>
      <h2 className="text-3xl">{title}</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5
      2xl:grid-cols-6 gap-8 mt-8 pb-10"
      >
        <NewBoardTrigger disabled={loading} orgId={orgId} />
        {data?.map((board) => {
          return (
            <BoardCard
              key={board._id}
              id={board._id}
              title={board.title}
              authorId={board.authorId}
              authorName={board.authorName}
              imageUrl={board.imageUrl}
              createdAt={board._creationTime}
              orgId={board.orgId}
              isFavorite={board.isFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};
export const BoardListSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-16 w-48" />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5
      2xl:grid-cols-6 gap-8 mt-8 pb-10"
      >
        {[...Array(6)].map((_, i) => {
          return <BoardCardSkeleton key={i} />;
        })}
      </div>
    </div>
  );
};
