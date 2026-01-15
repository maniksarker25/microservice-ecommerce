import { ActionType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { InventoryUpdateDTOSchema } from "../schemas";

const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.message });
  }

  const lastHistory = await prisma.history.findFirst({
    where: {
      inventoryId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let newQuantity = inventory.quantity;
  if (parsedBody.data.actionType === ActionType.IN) {
    newQuantity += parsedBody.data.quantity;
  } else if (parsedBody.data.actionType === ActionType.OUT) {
    newQuantity -= parsedBody.data.quantity;
  } else {
    return res.status(400).json({ message: "Invalid action type" });
  }

  // update inventory
  const updatedInventory = await prisma.inventory.update({
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

export default updateInventory;
