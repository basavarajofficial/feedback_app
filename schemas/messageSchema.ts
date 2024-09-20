import { z } from "zod"

export const messageSchema = z.object({
    content: z.string()
    .min(10, {message: "message must be atleast of 10 characters"})
    .max(500, {message: "message must be no more than 500 characters"})
})
