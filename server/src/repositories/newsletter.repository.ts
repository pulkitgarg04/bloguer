import prisma from './prisma';

export async function createNewsletterSubscriber(email: string) {
    return prisma.newsletterSubscriber.create({
        data: { email: email.toLowerCase() },
    });
}

export async function findNewsletterSubscriberByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({
        where: { email: email.toLowerCase() },
    });
}

export async function getAllNewsletterSubscribers() {
    return prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function deleteNewsletterSubscriber(email: string) {
    return prisma.newsletterSubscriber.delete({
        where: { email: email.toLowerCase() },
    });
}
