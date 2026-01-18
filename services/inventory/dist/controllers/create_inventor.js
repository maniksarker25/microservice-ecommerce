"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const schemas_1 = require("../schemas");
const createInventory = async (req, res, next) => {
    const parsedBody = schemas_1.InventoryCreateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error.message });
    }
    // create inventory
    const inventory = await prisma_1.default.inventory.create({
        data: {
            ...parsedBody.data,
            histories: {
                create: {
                    actionType: client_1.ActionType.IN,
                    quantityChanged: parsedBody.data.quantity,
                    lastQuantity: parsedBody.data.quantity,
                    newQuantity: parsedBody.data.quantity,
                },
            },
        },
    });
    return res.status(201).json(inventory);
};
exports.default = createInventory;
//# sourceMappingURL=create_inventor.js.map