import { Metadata, ResolvingMetadata } from "next";

import StyleCard from "@/app/_components/style-card";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
  const tags = await prisma.tags.findMany();
  return tags.map((tag) => ({ id: tag.id }));
}

interface TagPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: TagPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const tag = await prisma.tags.findUnique({
    where: { id: (await params).id },
  });

  return {
    title: tag?.name ?? (await parent).title,
  };
}

const TagPage = async ({ params }: TagPageProps) => {
  const tag = await prisma.tags.findUnique({
    where: { id: (await params).id },
    include: {
      styleTags: {
        include: {
          style: {
            include: {
              category: true,
              srmMinColor: true,
              srmMaxColor: true,
            },
          },
        },
      },
    },
  });

  if (!tag) {
    return <div>Tag not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-12">
      <h1 className="text-center text-2xl font-bold md:text-3xl">
        Styles tagged with {tag.name}
      </h1>

      <div className="flex flex-col gap-y-8">
        {tag.styleTags
          .sort((a, b) => a.style.name.localeCompare(b.style.name))
          .map(({ style }) => (
            <StyleCard
              key={style.id}
              id={style.id}
              name={style.name}
              overallImpression={style.overallImpression}
              srmMinColor={style.srmMinColor?.color}
              srmMaxColor={style.srmMaxColor?.color}
              category={style.category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default TagPage;
