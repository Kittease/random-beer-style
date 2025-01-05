import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import Link from "next/link";

const SubPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-y-12">
      <Link href="/?spin=true" className="group flex w-fit flex-row gap-x-2">
        <ArrowLeft className="transition-all duration-300 group-hover:mr-1" />
        <span className="font-bold">Get a new random style</span>
      </Link>

      {children}
    </div>
  );
};

export default SubPageLayout;
