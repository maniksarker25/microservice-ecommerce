import { ActionType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { InventoryCreateDTOSchema } from "../schemas";

const createInventory = async (req: Request, res: Response, next: NextFunction) => {
  const parsedBody = InventoryCreateDTOSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.message });
  }

  // create inventory
  const inventory = await prisma.inventory.create({
    data: {
      ...parsedBody.data,
      histories: {
        create: {
          actionType: ActionType.IN,
          quantityChanged: parsedBody.data.quantity,
          lastQuantity: parsedBody.data.quantity,
          newQuantity: parsedBody.data.quantity,
        },
      },
    },
  });

  return res.status(201).json(inventory);
};

export default createInventory;
