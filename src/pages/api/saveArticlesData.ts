// pages/api/articleconfig.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.id;

  if (req.method === "GET") {
    try {
      const articleConfig = await prisma.articleConfig.findUnique({
        where: { userId },
      });

      if (!articleConfig) {
        return res
          .status(404)
          .json({ message: "Article configuration not found" });
      }

      res.status(200).json(articleConfig);
    } catch (error) {
      console.error("Failed to retrieve article configuration:", error);
      res.status(500).json({
        message: "Failed to retrieve article configuration",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "PUT") {
    const { articleThumbnail, articleDisplayLayout, articleFeedLink } =
      req.body;

    try {
      let articleConfig = await prisma.articleConfig.findUnique({
        where: { userId },
      });

      if (!articleConfig) {
        articleConfig = await prisma.articleConfig.create({
          data: {
            userId,
            articleThumbnail,
            articleDisplayLayout,
            articleFeedLink,
          },
        });
      } else {
        articleConfig = await prisma.articleConfig.update({
          where: { userId },
          data: {
            articleThumbnail,
            articleDisplayLayout,
            articleFeedLink,
          },
        });
      }

      res.status(200).json(articleConfig);
    } catch (error) {
      console.error("Failed to update article configuration:", error);
      res.status(500).json({
        message: "Failed to update article configuration",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
