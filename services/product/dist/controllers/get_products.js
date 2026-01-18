"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const getProducts = async (req, res, next) => {
    try {
        const products = await prisma_1.default.product.findMany({
            select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                inventoryId: true,
            },
        });
        // TODO: Implement pagination
        //TODO: Implement filtering
        res.json({ data: products });
    }
    catch (error) {
        next(error);
    }
};
exports.default = getProducts;
//# sourceMappingURL=get_products.js.map