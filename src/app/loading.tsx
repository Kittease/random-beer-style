import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
      <LoaderCircle className="size-24 animate-spin text-gray-200 duration-500 ease-spin" />
    </div>
  );
};

export default Loading;
