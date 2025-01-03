export const dynamic = "force-dynamic";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import prisma from "@/lib/prisma";

import StyleHeader from "./_components/style-header";

type RawQueryResult = {
  id: string;
  name: string;
  overall_impression: string;
  category_id: string;
  category: string;
  srm_min_color: string;
  srm_max_color: string;
};

const RandomStylePage = async () => {
  const randomStyles = await prisma.$queryRaw<RawQueryResult[]>`SELECT
    styles.id,
    styles.name,
    styles.overall_impression,
    categories.id AS category_id,
    categories.name AS category,
    srm_min_colors.color AS srm_min_color,
    srm_max_colors.color AS srm_max_color
  FROM
    styles
    LEFT JOIN categories ON styles.category_id = categories.id
    LEFT JOIN colors AS srm_min_colors ON styles.srm_min_color_id = srm_min_colors.srm
    LEFT JOIN colors AS srm_max_colors ON styles.srm_max_color_id = srm_max_colors.srm
  ORDER BY RANDOM()
  LIMIT 1`;

  if (randomStyles.length === 0) {
    return <div>No style found</div>;
  }

  const style = randomStyles[0];

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-12">
        <StyleHeader
          name={style.name}
          category={style.category}
          categoryId={style.category_id}
          overallImpression={style.overall_impression}
          srmMinColor={style.srm_min_color}
          srmMaxColor={style.srm_max_color}
        />

        <Link
          href={`/styles/${style.id}`}
          className="group flex w-fit flex-row gap-x-2 rounded-full border-2 border-foreground px-4 py-2 transition-all duration-300 hover:scale-105"
        >
          <span className="font-bold">Read more</span>
          <ArrowRight className="transition-all duration-300 group-hover:ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RandomStylePage;
