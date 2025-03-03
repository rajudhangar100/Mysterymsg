import { z } from "zod";

export const acceptMsgSchema = z.object({
    isAcceptingMsg:z.boolean()
})