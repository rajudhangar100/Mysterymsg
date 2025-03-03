import { z } from "zod";

export const messagesSchema = z.object({
    content:z.string().min(5,"Messages must be atleast of 5 characters").max(300,"Messages must be no longer than 300 characters")
})