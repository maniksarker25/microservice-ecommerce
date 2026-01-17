import { Status } from "@prisma/client";
import z from "zod";

export const ProductCreateDTOSchema = z.object({
  sku: z.string().min(3).max(10),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  price: z.number().default(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});
