"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { UserAvatar } from "./user-avatar";
import { numberToColor } from "@/lib/utils";
const MAX_SHOWN_USER = 2;
export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const hasMoreUsers = users.length > MAX_SHOWN_USER;

  return (
    <div
      className="absolute h-14 top-2 right-2 bg-white  rounded-md p-3 flex
  items-center shadow-md"
    >
      <div className="flex space-x-2">
        {users.slice(0, MAX_SHOWN_USER).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              key={connectionId}
              name={info.name || "Anonymous"}
              src={info.picture}
              fallback={info.name?.[0] || "A"}
              borderColor={numberToColor(connectionId)}
            />
          );
        })}
        {currentUser && (
          <UserAvatar
            name={`${currentUser.info.name} (You)`}
            src={currentUser.info.picture}
            fallback={currentUser.info.name?.[0] || "A"}
            borderColor={numberToColor(currentUser.connectionId)}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USER} more`}
            fallback={`+${users.length - MAX_SHOWN_USER}`}
            borderColor={numberToColor(0)}
          />
        )}
      </div>
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div
      className="absolute h-12 w-12 top-2 right-2 rounded-md flex
  items-center shadow-md"
    >
      <Skeleton className="w-full h-full" />
    </div>
  );
};
