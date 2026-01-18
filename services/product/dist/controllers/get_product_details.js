"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../prisma"));
const getProductDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await prisma_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.inventoryId == null) {
            const { data: inventory } = await axios_1.default.post(`${config_1.INVENTORY_SERVICE_URL}/inventories`, {
                productId: product.id,
                sku: product.sku,
            });
            console.log("Inventory created successfully");
            await prisma_1.default.product.update({
                where: { id: product.id },
                data: { inventoryId: inventory.id },
            });
            console.log("Product updated successfully");
            return res.status(200).json({
                ...product,
                inventoryId: inventory.id,
                stock: inventory.quantity || 0,
                stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
            });
        }
        // if inventor have
        const { data: inventory } = await axios_1.default.get(`${config_1.INVENTORY_SERVICE_URL}/inventories/${product.inventoryId}`);
        console.log("inventory", inventory);
        return res.status(200).json({
            ...product,
            inventoryId: inventory.id,
            stock: inventory.quantity || 0,
            stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = getProductDetails;
//# sourceMappingURL=get_product_details.js.map