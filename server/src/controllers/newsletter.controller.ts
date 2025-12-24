import { Request, Response } from 'express';
import {
    subscribeToNewsletterService,
    getNewsletterSubscribersService,
    unsubscribeFromNewsletterService,
} from '../services/newsletter.service';

export const NewsletterController = {
    subscribe: async (req: Request, res: Response) => {
        try {
            const { email } = req.body as any;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const subscriber = await subscribeToNewsletterService(email);
            return res.status(201).json({
                message: 'Successfully subscribed to newsletter',
                subscriber,
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const subscribers = await getNewsletterSubscribersService();
            return res.json({
                message: 'Newsletter subscribers fetched',
                subscribers,
                count: subscribers.length,
            });
        } catch (error: any) {
            return res.status(500).json({ message: 'Failed to fetch subscribers' });
        }
    },

    unsubscribe: async (req: Request, res: Response) => {
        try {
            const { email } = req.body as any;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            await unsubscribeFromNewsletterService(email);
            return res.json({ message: 'Successfully unsubscribed from newsletter' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    },
};
