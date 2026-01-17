import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

const getSingleInventory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const inventory = await prisma.inventory.findUnique({
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

export default getSingleInventory;
