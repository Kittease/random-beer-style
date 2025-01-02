import { ChevronRight } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";

import prisma from "@/lib/prisma";
import Link from "next/link";

export async function generateStaticParams() {
  const categories = await prisma.categories.findMany();
  return categories.map((category) => ({ id: category.id }));
}

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const category = await prisma.categories.findUnique({
    where: { id: (await params).id },
  });

  return {
    title: category?.name ?? (await parent).title,
  };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await prisma.categories.findUnique({
    where: { id: (await params).id },
    include: {
      styles: {
        include: {
          srmMinColor: true,
          srmMaxColor: true,
        },
      },
    },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-12">
      <h1 className="text-2xl md:text-3xl text-center font-bold">
        {category.name} styles
      </h1>

      <div className="flex flex-col gap-y-8">
        {category.styles.map((style) => (
          <Link
            key={style.id}
            href={`/styles/${style.id}`}
            className="grid grid-cols-[min-content_auto_min-content] gap-2 md:gap-0 items-center bg-background border rounded-lg py-4 px-6 md:pl-0 shadow hover:-translate-y-2 hover:scale-105 transition-all duration-150"
          >
            {style.srmMinColor && style.srmMaxColor ? (
              <svg
                viewBox="0 0 100 100"
                className="size-12 md:size-28 md:row-span-2"
              >
                <defs>
                  <linearGradient
                    id={`gradient-${style.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                  >
                    <stop offset="0" stopColor={style.srmMaxColor.color} />
                    <stop offset="100%" stopColor={style.srmMinColor.color} />
                  </linearGradient>
                </defs>
                <path d="M50.001,97.045h-0.01c-2.939-0.028-17.712-0.417-19.817-5.333l-0.077-0.303l-5.062-55.587  c-1.68-3.059-2.531-6.324-2.531-9.712c0-2.159,0.358-4.307,1.064-6.386L22.581,8.896l0.062-0.194  c0.31-0.96,3.082-5.746,27.356-5.746s27.047,4.786,27.356,5.746l0.062,0.194l-0.986,10.829c0.706,2.078,1.064,4.226,1.064,6.386  c0,3.389-0.851,6.654-2.53,9.712l-5.078,55.744l-0.062,0.146c-2.105,4.916-16.876,5.305-19.815,5.333H50.001z M32.073,91.051  c1.481,2.793,11.717,3.933,17.928,3.994c6.21-0.062,16.444-1.201,17.927-3.994l5.086-55.834l0.104-0.186  c1.579-2.809,2.379-5.81,2.379-8.921c0-2.006-0.345-4.001-1.023-5.93l-0.072-0.206l0.979-10.752  c-0.536-0.63-4.487-4.268-25.38-4.268c-20.747,0-24.834,3.626-25.382,4.265l0.979,10.755l-0.072,0.206  c-0.68,1.93-1.023,3.925-1.023,5.93c0,3.109,0.801,6.111,2.379,8.921l0.105,0.186L32.073,91.051z" />
                <path
                  d="M27.592,16.604l0.615,4.661c-0.6,1.703-0.927,3.503-0.927,5.369c0,2.886,0.773,5.62,2.15,8.069l4.358,50.725  c1.677,3.913,16.212,4.053,16.212,4.053s14.534-0.14,16.21-4.053l4.358-50.725c1.377-2.449,2.15-5.184,2.15-8.069  c0-1.866-0.327-3.666-0.927-5.369l0.615-4.661c0,0-4.242-1.552-22.326-0.856C41.834,16.063,27.592,16.604,27.592,16.604z"
                  fill={`url(#gradient-${style.id})`}
                />
              </svg>
            ) : null}

            <h1 className="text-xl font-bold">{style.name}</h1>

            <p className="text-justify col-span-3 md:col-span-1 self-start">
              {style.overallImpression}
            </p>

            <ChevronRight className="hidden md:block row-span-2 row-start-1 col-start-3 ml-6" />

            <p className="block md:hidden col-span-3 text-right text-yellow-700">
              Read more
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
