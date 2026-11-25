import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Obsah, který se upravuje v administraci (/admin).
// Každá položka je jeden malý soubor .yml ve složce src/content/...

const text = z.string().nullish().transform((v) => v ?? '');
const order = z.number().nullish().transform((v) => v ?? 100);

const menu = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/menu' }),
  schema: z.object({
    nazev: z.string(),
    kategorie: z.enum(['Káva', 'Čaj a další', 'Sladké', 'Večer']),
    popis: text,
    cena: z.number(),
    doporucujeme: z.boolean().nullish().transform((v) => v ?? false),
    poradi: order,
  }),
});

const akce = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/akce' }),
  schema: z.object({
    nazev: z.string(),
    datum: z.union([z.string(), z.date()]),
    cas: z.union([z.string(), z.number()]).transform((v) => String(v)),
    vstupne: z.number().nullish().transform((v) => v ?? 0),
    popis: text,
  }),
});

const galerie = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/galerie' }),
  schema: z.object({
    foto: z.string(),
    popisek: z.string(),
    poradi: order,
  }),
});

export const collections = { menu, akce, galerie };
