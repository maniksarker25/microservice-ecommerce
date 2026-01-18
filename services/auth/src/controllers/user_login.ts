import { AccountStatus, LoginAttempt } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { UserLoginSchema } from "../schemas";

type TLoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttempt;
};

const createLoginHistory = async (info: TLoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: info.userId,
      userAgent: info.userAgent,
      ipAddress: info.ipAddress,
      attempt: info.attempt,
    },
  });
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const userAgent = req.headers["user-agent"] || " ";

    const parseBody = UserLoginSchema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error });
    }

    // check if user  exits
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parseBody.data.email,
      },
    });

    if (!existingUser) {
      createLoginHistory({ userId: "Guest", userAgent, ipAddress, attempt: LoginAttempt.FAILED });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // hash password
    const isPasswordMatched = await bcrypt.compare(parseBody.data.password, existingUser.password);
    if (!isPasswordMatched) {
      createLoginHistory({
        userId: existingUser.id,
        userAgent,
        ipAddress,
        attempt: LoginAttempt.FAILED,
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!existingUser.verified) {
      createLoginHistory({
        userId: existingUser.id,
        userAgent,
        ipAddress,
        attempt: LoginAttempt.FAILED,
      });

      return res.status(400).json({ message: "User not verified" });
    }
    if (existingUser.status != AccountStatus.ACTIVE) {
      createLoginHistory({
        userId: existingUser.id,
        userAgent,
        ipAddress,
        attempt: LoginAttempt.FAILED,
      });

      return res
        .status(400)
        .json({ message: `Your account is ${existingUser.status.toLocaleLowerCase()}` });
    }

    const accessToken = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" },
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export default userLogin;
