import z from "zod";

export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(150),
  name: z.string(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AccessTokenSchema = z.object({
  accessToken: z.string(),
});
