import { Minus, Plus, TrendingUp } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import StyleHeader from "@/app/_components/style-header";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
  const styles = await prisma.styles.findMany();
  return styles.map((style) => ({ id: style.id }));
}

interface StylePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: StylePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const style = await prisma.styles.findUnique({
    where: { id: (await params).id },
  });

  return {
    title: style?.name ?? (await parent).title,
  };
}

const StylePage = async ({ params }: StylePageProps) => {
  const style = await prisma.styles.findUnique({
    where: { id: (await params).id },
    include: {
      category: true,
      srmMinColor: true,
      srmMaxColor: true,
      styleTags: {
        include: {
          tag: true,
        },
        orderBy: {
          tag: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!style) {
    return <div>Style not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <StyleHeader
        name={style.name}
        category={style.category.name}
        categoryId={style.category.id}
        overallImpression={style.overallImpression}
        srmMinColor={style.srmMinColor?.color ?? undefined}
        srmMaxColor={style.srmMaxColor?.color ?? undefined}
      />

      {(style.abvMin && style.abvMax) ||
      (style.ibuMin && style.ibuMax) ||
      (style.ogMin && style.ogMax) ||
      (style.fgMin && style.fgMax) ? (
        <dl className="flex flex-row flex-wrap items-center justify-between gap-y-4 py-4">
          {style.abvMin && style.abvMax ? (
            <div className="flex flex-col items-center">
              <dt className="font-bold">ABV</dt>

              <dd className="flex flex-row items-center gap-x-2">
                <Minus className="size-3 text-gray-400" />
                <span>{style.abvMin}</span>
                <TrendingUp className="size-5 text-gray-400" />
                <span>{style.abvMax}</span>
                <Plus className="size-3 text-gray-400" />
              </dd>
            </div>
          ) : null}

          {style.ibuMin && style.ibuMax ? (
            <div className="flex flex-col items-center">
              <dt className="font-bold">IBU</dt>

              <dd className="flex flex-row items-center gap-x-2">
                <Minus className="size-3 text-gray-400" />
                <span>{style.ibuMin}</span>
                <TrendingUp className="size-5 text-gray-400" />
                <span>{style.ibuMax}</span>
                <Plus className="size-3 text-gray-400" />
              </dd>
            </div>
          ) : null}

          {style.srmMinColor && style.srmMaxColor ? (
            <div className="flex flex-col items-center">
              <dt className="font-bold">EBC</dt>

              <dd className="flex flex-row items-center gap-x-2">
                <Minus className="size-3 text-gray-400" />
                <span>{Math.round(style.srmMinColor.srm * 1.97)}</span>
                <TrendingUp className="size-5 text-gray-400" />
                <span>{Math.round(style.srmMaxColor.srm * 1.97)}</span>
                <Plus className="size-3 text-gray-400" />
              </dd>
            </div>
          ) : null}

          {style.ogMin && style.ogMax ? (
            <div className="flex flex-col items-center">
              <dt className="font-bold">Original Gravity</dt>

              <dd className="flex flex-row items-center gap-x-2">
                <Minus className="size-3 text-gray-400" />
                <span>{style.ogMin.toFixed(3)}</span>
                <TrendingUp className="size-5 text-gray-400" />
                <span>{style.ogMax.toFixed(3)}</span>
                <Plus className="size-3 text-gray-400" />
              </dd>
            </div>
          ) : null}

          {style.fgMin && style.fgMax ? (
            <div className="flex flex-col items-center">
              <dt className="font-bold">Final Gravity</dt>

              <dd className="flex flex-row items-center gap-x-2">
                <Minus className="size-3 text-gray-400" />
                <span>{style.fgMin.toFixed(3)}</span>
                <TrendingUp className="size-5 text-gray-400" />
                <span>{style.fgMax.toFixed(3)}</span>
                <Plus className="size-3 text-gray-400" />
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <dl className="flex flex-col gap-y-4 py-4">
        <div className="flex flex-col">
          <dt className="font-bold">Appearance</dt>
          <dd className="text-justify">{style.appearance}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Aroma</dt>
          <dd className="text-justify">{style.aroma}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Flavor</dt>
          <dd className="text-justify">{style.flavor}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Mouthfeel</dt>
          <dd className="text-justify">{style.mouthfeel}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">History</dt>
          <dd className="text-justify">{style.history}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Characteristic Ingredients</dt>
          <dd className="text-justify">{style.characteristicIngredients}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Style Comparison</dt>
          <dd className="text-justify">{style.styleComparison}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Comments</dt>
          <dd className="text-justify">{style.comments}</dd>
        </div>

        <div className="flex flex-col">
          <dt className="font-bold">Commercial Examples</dt>
          <dd className="text-justify">{style.commercialExamples}</dd>
        </div>
      </dl>

      <span className="pt-4">
        {style.styleTags.map(({ tag }, i) => (
          <Fragment key={tag.id}>
            <Link href={`/tags/${tag.id}`} className="text-yellow-700">
              {tag.name}
            </Link>

            {i < style.styleTags.length - 1 ? ", " : null}
          </Fragment>
        ))}
      </span>
    </div>
  );
};

export default StylePage;
