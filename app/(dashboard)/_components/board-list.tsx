import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CreateBoardButton } from "./create-board-button";

interface BoardListProps {
  orgId?: string;
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
export const BoardList = ({ query }: BoardListProps) => {
  const data = [];
  if (!data.length && query.search) {
    return (
      <EmptyBoard
        src="/nothing.png"
        title="No results found!"
        subtitle="Try searching something else!"
      />
    );
  }
  if (!data.length && query.favorite) {
    return (
      <EmptyBoard
        src="/nofavorite.png"
        title="No favorites boards"
        subtitle="Try favoriting boards"
      />
    );
  }
  if (!data.length) {
    return (
      <EmptyBoard
        src="/noboard.png"
        title="No boards"
        subtitle="Try creating a new board for your organization"
        action={<CreateBoardButton label="Create a board" />}
      />
    );
  }
  return <div>Board List</div>;
};
