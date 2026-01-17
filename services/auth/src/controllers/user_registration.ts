import axios from "axios";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { USER_SERVICE_URL } from "../config";
import prisma from "../prisma";
import { UserCreateSchema } from "../schemas";
const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = UserCreateSchema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error });
    }

    // check if user already exits
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parseBody.data.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exits" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parseBody.data.password, salt);

    // create auth user
    const user = await prisma.user.create({
      data: {
        ...parseBody.data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        status: true,
        verified: true,
      },
    });

    console.log("User created", user);

    // crate user profile by calling user service
    await axios.post(`${USER_SERVICE_URL}/users`, {
      authUserId: user.id,
      name: user.name,
      email: user.email,
    });

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export default userRegistration;
