'use server';
import { Prisma, Status } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import "dotenv/config";

export async function getWatchedContent() {
    const response = await prisma.content.findMany();
    if (response) return response;
    return false;
}

export async function getDetailsOfTheContent(name: string) {
    const response = await prisma.watchlog.findFirst({ where: { content: { name } }, include: { content: true } });
    if (!response) return null;
    return response;
}

export async function verifyPassword(password: string) {
    const isValid = await bcrypt.compare(password, process.env.PASSWORD!)
    return isValid;
}

export async function addContent({ name, year, type, seasons, episodes, description }: Prisma.ContentCreateInput) {
    const response = await prisma.content.create({ data: { name, year, type, seasons, episodes, description } })
    await prisma.watchlog.create({ data: { content_id: response.id, status: Status.watched } })
    return response;
}