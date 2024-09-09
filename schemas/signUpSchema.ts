import { z } from "zod";

export const usernameValidationSchema = z
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(15, "username must not be more than 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidationSchema,

    email: z.string().email({message: "Invalid email address"}),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
  });
