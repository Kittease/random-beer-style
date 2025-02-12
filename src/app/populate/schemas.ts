import { z } from "zod";

export const dataSchema = z.array(
  z.object({
    name: z.string(),
    number: z.string(),
    category: z.string(),
    categorynumber: z.string(),
    overallimpression: z.string(),
    aroma: z.string(),
    appearance: z.string(),
    flavor: z.string(),
    mouthfeel: z.string(),
    comments: z.string(),
    history: z.string(),
    characteristicingredients: z.string(),
    stylecomparison: z.string(),
    ibumin: z.coerce.number().optional(),
    ibumax: z.coerce.number().optional(),
    ogmin: z.coerce.number().optional(),
    ogmax: z.coerce.number().optional(),
    fgmin: z.coerce.number().optional(),
    fgmax: z.coerce.number().optional(),
    abvmin: z.coerce.number().optional(),
    abvmax: z.coerce.number().optional(),
    srmmin: z.coerce.number().optional(),
    srmmax: z.coerce.number().optional(),
    commercialexamples: z.string(),
    tags: z.string(),
    entryinstructions: z.string().optional(),
    currentlydefinedtypes: z.string().optional(),
    strengthclassifications: z.string().optional(),
  }),
);
