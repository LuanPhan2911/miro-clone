"use client";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isFavorite: boolean;
}
const Overlay = () => {
  return (
    <div
      className="opacity-0 group-hover:opacity-50 h-full w-full
    transition-opacity bg-black rounded-lg"
    ></div>
  );
};
export const BoardCard = ({
  authorId,
  authorName,
  createdAt,
  id,
  imageUrl,
  isFavorite,
  orgId,
  title,
}: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorName;
  const createdLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });
  return (
    <Link href={`/boards/${id}`}>
      <div
        className="group aspect-[100/127] border rounded-lg flex flex-col 
    justify-between overflow-hidden"
      >
        <div className="relative flex-1 bg-amber-50 rounded-lg">
          <Image src={imageUrl} alt={title} fill className="object-fill" />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <button
              className="absolute z-50 top-0 right-1
            opacity-0 group-hover:opacity-100 transition-opacity py-2 outline-none"
            >
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100" />
            </button>
          </Actions>
        </div>
        <Footer
          authorLabel={authorLabel}
          createdLabel={createdLabel}
          isFavorite={true}
          onClick={() => {}}
          title={title}
          disabled={false}
        />
      </div>
    </Link>
  );
};
export const BoardCardSkeleton = () => {
  return (
    <div
      className="aspect-[100/127] border rounded-lg p-6 flex flex-col 
    justify-between gap-y-2"
    >
      <Skeleton className="relative flex-1" />
      <Skeleton className="w-20 h-5" />
    </div>
  );
};
