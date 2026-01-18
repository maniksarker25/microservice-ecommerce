"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryUpdateDTOSchema = exports.InventoryCreateDTOSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.InventoryCreateDTOSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    sku: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive().optional().default(0),
});
// export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
exports.InventoryUpdateDTOSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive().optional().default(0),
    actionType: zod_1.z.nativeEnum(client_1.ActionType),
});
//# sourceMappingURL=schemas.js.map