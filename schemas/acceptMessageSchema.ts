import { z } from "zod"


export const acceptMessagSchema = z.object({
    isAcceptingMessage : z.boolean(),
})
