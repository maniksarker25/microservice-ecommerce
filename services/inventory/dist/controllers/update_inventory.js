"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const schemas_1 = require("../schemas");
const updateInventory = async (req, res, next) => {
    const id = req.params.id;
    const inventory = await prisma_1.default.inventory.findUnique({
        where: { id },
    });
    if (!inventory) {
        return res.status(404).json({ message: "Inventory not found" });
    }
    const parsedBody = schemas_1.InventoryUpdateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ error: parsedBody.error.message });
    }
    const lastHistory = await prisma_1.default.history.findFirst({
        where: {
            inventoryId: id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    let newQuantity = inventory.quantity;
    if (parsedBody.data.actionType === client_1.ActionType.IN) {
        newQuantity += parsedBody.data.quantity;
    }
    else if (parsedBody.data.actionType === client_1.ActionType.OUT) {
        newQuantity -= parsedBody.data.quantity;
    }
    else {
        return res.status(400).json({ message: "Invalid action type" });
    }
    // update inventory
    const updatedInventory = await prisma_1.default.inventory.update({
        where: { id },
        data: {
            quantity: newQuantity,
            histories: {
                create: {
                    actionType: parsedBody.data.actionType,
                    quantityChanged: parsedBody.data.quantity,
                    lastQuantity: lastHistory?.newQuantity || 0,
                    newQuantity,
                },
            },
        },
    });
    return res.status(200).json(updatedInventory);
};
exports.default = updateInventory;
//# sourceMappingURL=update_inventory.js.map