import prisma from './prisma';

export async function createContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
}) {
    return prisma.contactMessage.create({
        data,
    });
}

export async function getAllContactMessages() {
    return prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function getContactMessageById(id: string) {
    return prisma.contactMessage.findUnique({
        where: { id },
    });
}

export async function deleteContactMessage(id: string) {
    return prisma.contactMessage.delete({
        where: { id },
    });
}
