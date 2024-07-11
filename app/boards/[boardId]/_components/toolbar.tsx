import { Skeleton } from "@/components/ui/skeleton";

export const Toolbar = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%]
  left-2 flex flex-col gap-y-4"
    >
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
        <div>Pencil</div>
        <div>Pen</div>
        <div>Square</div>
        <div>Circle</div>
        <div>Ellipsis</div>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
        <div>Redo</div>
        <div>Undo</div>
      </div>
    </div>
  );
};
Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%]
  left-2 flex flex-col h-[360px] w-[52px]"
    >
      <Skeleton className="h-full w-full" />
    </div>
  );
};
