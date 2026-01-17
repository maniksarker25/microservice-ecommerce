"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const getSingleInventory = async (req, res, next) => {
    const id = req.params.id;
    const inventory = await prisma_1.default.inventory.findUnique({
        where: {
            id,
        },
        select: {
            quantity: true,
            id: true,
        },
    });
    if (!inventory) {
        return res.status(404).json({ message: "Inventory not found" });
    }
    return res.status(200).json(inventory);
};
exports.default = getSingleInventory;
//# sourceMappingURL=get_single_inventory.js.map