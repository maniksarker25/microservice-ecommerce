"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCreateDTOSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.ProductCreateDTOSchema = zod_1.default.object({
    sku: zod_1.default.string().min(3).max(10),
    name: zod_1.default.string().min(3).max(255),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().default(0),
    status: zod_1.default.nativeEnum(client_1.Status).optional().default(client_1.Status.DRAFT),
});
//# sourceMappingURL=schemas.js.map