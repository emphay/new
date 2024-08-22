import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { presentationTitle, presentationLink, dateOfPresentation } = req.body;
  const session = await getServerSession(req, res, authOptions);

  if(session)
    {
      await prisma.presentation.create({
        data: {
          userId: session.id,
          presentationTitle: presentationTitle,
          presentationLink: presentationLink,
          dateOfPresentation: new Date(dateOfPresentation),
        }
      })
    }
  res.redirect('/');
}
