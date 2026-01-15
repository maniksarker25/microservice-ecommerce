import { z } from "zod";

export const InventoryCreateDTOSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  quantity: z.number().int().positive().optional().default(0),
});

// export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;

export const InventoryUpdateDTOSchema = z.object({
  productId: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.number().int().positive().optional().default(0),
});
