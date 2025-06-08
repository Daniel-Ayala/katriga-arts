import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    date: z.string(),
    author: z.string(),
    authorImage: z.string(),
    authorBio: z.string(),
    authorSocial: z.object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    }).optional(),
    image: z.string(),
    imageAlt: z.string(),
    imageCaption: z.string().optional(),
    description: z.string(),
    metaDescription: z.string().optional(),
    relatedPosts: z.array(z.string()).optional(),
  })
});

export const collections = {"blog":blog};