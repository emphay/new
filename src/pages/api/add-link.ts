import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, url, icon } = req.body;

    if (req.method === 'POST') {
        // Handle creation of new link
        try {
            await prisma.link.create({
                data: {
                    userId: session.id,
                    url,
                    title,
                    icon
                }
            });
            return res.status(201).json({ message: 'Link created successfully' });
        } catch (error) {
            console.error('Error creating link:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        // Handle update of existing link
        try {
            const existingLink = await prisma.link.findFirst({
                where: { userId: session.id, title }
            });

            if (!existingLink) {
                return res.status(404).json({ error: 'Link not found' });
            }

            await prisma.link.update({
                where: { id: existingLink.id },
                data: {
                    url,
                    icon
                }
            });

            return res.status(200).json({ message: 'Link updated successfully' });
        } catch (error) {
            console.error('Error updating link:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
