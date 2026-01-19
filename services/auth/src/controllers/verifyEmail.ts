import { VerificationStatus } from "@prisma/client";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { EMAIL_SERVICE_URL } from "../config";
import prisma from "../prisma";
import { EmailVerificationSchema } from "../schemas";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate the request body
    const parseBody = EmailVerificationSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error });
    }

    const user = await prisma.user.findUnique({ where: { email: parseBody.data.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user?.id,
        code: parseBody.data.code,
      },
    });

    if (!verificationCode) {
      return res.status(404).json({ message: "Invalid verification code" });
    }

    if (verificationCode.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // update
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, status: "ACTIVE" },
    });

    // update code status
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: {
        verificationStatus: VerificationStatus.USED,
        verifiedAt: new Date(),
      },
    });

    // send success email
    await axios.post(`${EMAIL_SERVICE_URL}/emails/send`, {
      recipient: user.email,
      subject: "Email verified",
      body: "Your email has been verified successfully",
      source: "verify-email",
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;
