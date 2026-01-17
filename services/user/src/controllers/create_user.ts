import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { UserCreateSchema } from "../schemas";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error });
    }

    // check if auth user id already exits
    const existingUser = await prisma.user.findUnique({
      where: { authUserId: parsedBody.data.authUserId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await prisma.user.create({
      data: parsedBody.data,
    });

    return res.status(201).json(user);
  } catch (error) {
    next();
  }
};
