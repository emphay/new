import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { projectTitle, projectDescription, projectLink } = req.body;
  const session = await getServerSession(req, res, authOptions);

  if(session)
    {
      await prisma.project.create({
        data: {
          userId: session.id,
          projectTitle: projectTitle,
          projectDescription: projectDescription || null,
          projectLink: projectLink
        }
      })
    }
  res.redirect('/');
}
