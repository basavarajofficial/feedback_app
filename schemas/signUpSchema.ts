import { z } from "zod";


export const signUpSchema = z.object({
    username: z.string()
    .min(3, "username must be ")
    .max(15, "username must not be more than 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters"),

    email: z.string().email({message: "Invalid email address"}),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
  });
