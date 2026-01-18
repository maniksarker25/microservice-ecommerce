import { NextFunction, Request, Response } from "express";
import { defaultSender, transporter } from "../config";
import prisma from "../prisma";
import { EmailCreateSchema } from "../schemas";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = EmailCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error });
    }

    // create mail options
    const { sender, recipient, subject, body, source } = parsedBody.data;
    const from = sender || defaultSender;
    const options = {
      from,
      to: recipient,
      subject,
      text: body,
    };

    const { rejected } = await transporter.sendMail(options);
    if (rejected.length) {
      console.log(rejected);
      return res.status(500).json({ message: "Failed to send email" });
    }

    await prisma.email.create({
      data: {
        sender: from,
        recipient,
        subject,
        body,
        source,
      },
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};
