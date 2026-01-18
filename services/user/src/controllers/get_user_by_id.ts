import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
// /users/:id?field=id|authUserId
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const field = req.query.field as string;
    let filter: any = {};
    if (field == "authUserId") {
      filter.authUserId = id;
    } else {
      filter.id = id;
    }
    const user = await prisma.user.findUnique({ where: filter });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default getUserById;
