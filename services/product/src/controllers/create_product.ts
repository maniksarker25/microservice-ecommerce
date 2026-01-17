import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { INVENTORY_SERVICE_URL } from "../config";
import prisma from "../prisma";
import { ProductCreateDTOSchema } from "../schemas";
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = ProductCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ message: "Invalid request body", errors: parseBody.error });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: parseBody.data.sku,
      },
    });

    if (existingProduct) {
      return res.status(400).json({ message: "Product with the same SKU already exists" });
    }

    // create product
    const product = await prisma.product.create({
      data: parseBody.data,
    });

    const { data: inventory } = await axios.post(`${INVENTORY_SERVICE_URL}/inventories`, {
      productId: product.id,
      sku: product.sku,
    });

    console.log("Inventory created successfully", inventory.id);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        inventoryId: inventory.id,
      },
    });

    return res.status(201).json({ ...product, inventoryId: inventory.id });
  } catch (error) {
    next(error);
  }
};

export default createProduct;
