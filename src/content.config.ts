import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			author: z.string().optional(),
			tags: z.array(z.string()).optional(),
		}),
});

const docs = defineCollection({
	// Pàgines d'ajuda i legals: un fitxer MDX per pàgina i idioma.
	loader: glob({ base: './src/content/docs', pattern: '**/*.mdx' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		section: z.enum(['help', 'legal']),
		order: z.number().default(99),
		/**
		 * Segment de la URL pública, amb majúscules si cal (privacyPolicy).
		 * El loader `glob` passa els ids a minúscules, i l'app mòbil té aquestes
		 * rutes escrites en dur, així que no podem dependre de l'id.
		 */
		route: z.string(),
	}),
});

export const collections = { blog, docs };
