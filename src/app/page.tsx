import prisma from "@/lib/prisma";

import Wheel from "./_components/wheel";

const RandomStylePage = async () => {
  const styles = await prisma.styles
    .findMany({
      include: {
        category: true,
        srmMinColor: true,
        srmMaxColor: true,
      },
    })
    .then((styles) =>
      styles
        .map((style) => ({
          id: style.id,
          name: style.name,
          category: style.category.name,
          categoryId: style.categoryId,
          overallImpression: style.overallImpression,
          srmMinColor: style.srmMinColor?.color,
          srmMaxColor: style.srmMaxColor?.color,
        }))
        .sort(() => Math.random() - 0.5),
    );

  const defaultGradientStops = await prisma.colors
    .findMany()
    .then((colors) => colors.map(({ color }) => color));

  return <Wheel styles={styles} defaultGradientStops={defaultGradientStops} />;
};

export default RandomStylePage;
