import { defineCollection,z } from "astro:content";
//z -> zod schema

const products = defineCollection({
    schema: z.object({
        title: z.string().min(3).max(100),
        img:z.string(),
        price: z.number().positive(),
    }),
})

const ocasiones = defineCollection({
    schema: z.object({
        img: z.string(),
        title: z.string().min(3).max(100),
        impact: z.string(),
        description: z.string(),
        btn: z.string()
    }),
})

export const collections = {products, ocasiones}