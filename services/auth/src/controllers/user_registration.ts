import axios from "axios";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { EMAIL_SERVICE_URL, USER_SERVICE_URL } from "../config";
import prisma from "../prisma";
import { UserCreateSchema } from "../schemas";
import generateCode from "../utils";
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

    //  generate verification code
    const code = generateCode();

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    //  send verification email
    await axios.post(`${EMAIL_SERVICE_URL}/emails/send`, {
      recipient: user.email,
      subject: "Email verification",
      body: `Your verification code is ${code}`,
      source: "user-registration",
    });

    return res
      .status(201)
      .json({ message: "User created , check your email for verification code", user });
  } catch (error) {
    next(error);
  }
};

export default userRegistration;
