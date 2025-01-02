import { Metadata, ResolvingMetadata } from "next";

import StyleCard from "@/app/_components/style-card";
import prisma from "@/lib/prisma";

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
        orderBy: {
          name: "asc",
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
          <StyleCard
            key={style.id}
            id={style.id}
            name={style.name}
            overallImpression={style.overallImpression}
            srmMinColor={style.srmMinColor?.color}
            srmMaxColor={style.srmMaxColor?.color}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
