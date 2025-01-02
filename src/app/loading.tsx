import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] w-full flex items-center justify-center">
      <LoaderCircle className="size-24 text-gray-200 animate-spin ease-spin duration-500" />
    </div>
  );
};

export default Loading;
