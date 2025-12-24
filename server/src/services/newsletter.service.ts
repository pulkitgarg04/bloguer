import {
    createNewsletterSubscriber,
    findNewsletterSubscriberByEmail,
    getAllNewsletterSubscribers,
    deleteNewsletterSubscriber,
} from '../repositories/newsletter.repository';

export async function subscribeToNewsletterService(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
        throw new Error('Invalid email address');
    }

    const existing = await findNewsletterSubscriberByEmail(email);
    if (existing) {
        throw new Error('Email is already subscribed');
    }

    return createNewsletterSubscriber(email);
}

export async function getNewsletterSubscribersService() {
    return getAllNewsletterSubscribers();
}

export async function unsubscribeFromNewsletterService(email: string) {
    const existing = await findNewsletterSubscriberByEmail(email);
    if (!existing) {
        throw new Error('Email not found in newsletter');
    }

    return deleteNewsletterSubscriber(email);
}
