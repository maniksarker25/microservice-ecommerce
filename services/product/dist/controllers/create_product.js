"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../prisma"));
const schemas_1 = require("../schemas");
const createProduct = async (req, res, next) => {
    try {
        const parseBody = schemas_1.ProductCreateDTOSchema.safeParse(req.body);
        if (!parseBody.success) {
            return res.status(400).json({ message: "Invalid request body", errors: parseBody.error });
        }
        const existingProduct = await prisma_1.default.product.findFirst({
            where: {
                sku: parseBody.data.sku,
            },
        });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with the same SKU already exists" });
        }
        // create product
        const product = await prisma_1.default.product.create({
            data: parseBody.data,
        });
        const { data: inventory } = await axios_1.default.post(`${config_1.INVENTORY_SERVICE_URL}/inventories`, {
            productId: product.id,
            sku: product.sku,
        });
        console.log("Inventory created successfully", inventory.id);
        await prisma_1.default.product.update({
            where: { id: product.id },
            data: {
                inventoryId: inventory.id,
            },
        });
        return res.status(201).json({ ...product, inventoryId: inventory.id });
    }
    catch (error) {
        next(error);
    }
};
exports.default = createProduct;
//# sourceMappingURL=create_product.js.map