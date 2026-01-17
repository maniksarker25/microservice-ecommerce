import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { INVENTORY_SERVICE_URL } from "../config";
import prisma from "../prisma";

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.inventoryId == null) {
      const { data: inventory } = await axios.post(`${INVENTORY_SERVICE_URL}/inventories`, {
        productId: product.id,
        sku: product.sku,
      });
      console.log("Inventory created successfully");

      await prisma.product.update({
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
    const { data: inventory } = await axios.get(
      `${INVENTORY_SERVICE_URL}/inventories/get-single${product.inventoryId}`
    );
    return res.status(200).json({
      ...product,
      inventoryId: inventory.id,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
    });
  } catch (error) {
    next(error);
  }
};

export default getProductDetails;
