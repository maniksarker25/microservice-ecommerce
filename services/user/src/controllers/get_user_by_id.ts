import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next();
  }
};

export default getUserById;
