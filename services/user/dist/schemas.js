"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateSchema = exports.UserCreateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.UserCreateSchema = zod_1.default.object({
    authUserId: zod_1.default.string(),
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    address: zod_1.default.string().optional(),
    phone: zod_1.default.string().optional(),
});
exports.UserUpdateSchema = exports.UserCreateSchema.omit({ authUserId: true }).partial();
//# sourceMappingURL=schemas.js.map