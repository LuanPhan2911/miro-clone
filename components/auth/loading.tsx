import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Image
        src={"/logo.svg"}
        className="animate-pulse duration-700"
        width={240}
        height={240}
        alt="Loading"
      />
    </div>
  );
};
