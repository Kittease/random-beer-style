import { promises as fs } from "fs";

import prisma from "@/lib/prisma";

import { dataSchema } from "./schemas";

enum Tag {
  AnyFermentation = "any-fermentation",
  BockFamily = "bock-family",
  BottomFermented = "bottom-fermentation",
  BritishIsles = "british-isles",
  CentralEurope = "central-europe",
  DarkLagerFamily = "dark-lager-family",
  NorthAmerica = "north-america",
  SpecialtyFamily = "specialty-family",
  TopFermented = "top-fermentation",
  WesternEurope = "western-europe",
  WildFermentation = "wild-fermentation",
}

const duplicatedTagsMap: Record<string, Tag> = {
  "any fermentation": Tag.AnyFermentation,
  bockfamily: Tag.BockFamily,
  "bottom fermented": Tag.BottomFermented,
  "bottom-fermented": Tag.BottomFermented,
  britishisles: Tag.BritishIsles,
  centraleurope: Tag.CentralEurope,
  "dark-lagerfamily": Tag.DarkLagerFamily,
  "north america": Tag.NorthAmerica,
  northamerica: Tag.NorthAmerica,
  "specialty-beer": Tag.SpecialtyFamily,
  specialtybeer: Tag.SpecialtyFamily,
  "top-fermented": Tag.TopFermented,
  "western europe": Tag.WesternEurope,
  westerneurope: Tag.WesternEurope,
  "wild-fermented": Tag.WildFermentation,
};

const srmColors = {
  1: "#FFF099",
  2: "#FFE699",
  3: "#FFD878",
  4: "#FFCA5A",
  5: "#FFBF42",
  6: "#FBB123",
  7: "#F8A600",
  8: "#F39C00",
  9: "#EA8F00",
  10: "#E58500",
  11: "#DE7C00",
  12: "#D77200",
  13: "#CF6900",
  14: "#CB6200",
  15: "#C35900",
  16: "#BB5100",
  17: "#B54C00",
  18: "#B04500",
  19: "#A63E00",
  20: "#A13700",
  21: "#9B3200",
  22: "#952D00",
  23: "#8E2900",
  24: "#882300",
  25: "#821E00",
  26: "#7B1A00",
  27: "#771900",
  28: "#701400",
  29: "#6A0E00",
  30: "#660D00",
  31: "#5E0B00",
  32: "#5A0A02",
  33: "#600903",
  34: "#520907",
  35: "#4C0505",
  36: "#470606",
  37: "#440607",
  38: "#3F0708",
  39: "#3B0607",
  40: "#3A070B",
  41: "#36080A",
  42: "#1E0204",
};

export async function GET() {
  let file: string;
  try {
    file = await fs.readFile(
      process.cwd() + "/src/app/populate/styles.json",
      "utf8",
    );
  } catch (error) {
    console.error(error);
    return new Response("Missing styles.json file", { status: 500 });
  }

  const { success, data, error } = dataSchema.safeParse(JSON.parse(file));

  if (!success) {
    console.error(error);
    return new Response("Failed to parse styles", { status: 500 });
  }

  await prisma.styleTags.deleteMany();
  await prisma.styles.deleteMany();
  await prisma.colors.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.tags.deleteMany();

  await Promise.all([
    prisma.colors.createMany({
      data: Object.entries(srmColors).map(([srm, color]) => ({
        srm: parseInt(srm),
        color,
      })),
    }),

    prisma.categories.createMany({
      data: Object.values(
        data.reduce(
          (acc, style) => {
            if (!acc[style.categorynumber]) {
              acc[style.categorynumber] = {
                id: style.categorynumber,
                name: style.category,
              };
            }
            return acc;
          },
          {} as Record<string, { id: string; name: string }>,
        ),
      ),
    }),

    prisma.tags.createMany({
      data: [
        ...new Set(
          data.flatMap((style) =>
            style.tags.split(",").map((rawTag) => {
              const tag = rawTag.trim();
              return duplicatedTagsMap[tag] ?? tag;
            }),
          ),
        ),
      ].map((tag) => ({
        id: tag,
        name: tag
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" "),
      })),
    }),
  ]);

  await prisma.styles.createMany({
    data: data.map((style) => ({
      id: style.number,
      name: style.name,
      categoryId: style.categorynumber,
      overallImpression: style.overallimpression,
      aroma: style.aroma,
      appearance: style.appearance,
      flavor: style.flavor,
      mouthfeel: style.mouthfeel,
      comments: style.comments,
      history: style.history,
      characteristicIngredients: style.characteristicingredients,
      styleComparison: style.stylecomparison,
      commercialExamples: style.commercialexamples,
      abvMin: style.abvmin,
      abvMax: style.abvmax,
      ibuMin: style.ibumin,
      ibuMax: style.ibumax,
      srmMinColorId: style.srmmin,
      srmMaxColorId: style.srmmax,
      ogMin: style.ogmin,
      ogMax: style.ogmax,
      fgMin: style.fgmin,
      fgMax: style.fgmax,
    })),
  });

  await prisma.styleTags.createMany({
    data: data.flatMap(({ number: styleId, tags }) =>
      tags.split(",").map((rawTag) => {
        const tag = rawTag.trim();
        return {
          styleId,
          tagId: duplicatedTagsMap[tag] ?? tag,
        };
      }),
    ),
  });

  return new Response("Successfully populated styles", { status: 200 });
}
