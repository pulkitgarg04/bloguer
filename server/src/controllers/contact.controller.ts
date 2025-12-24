import { Request, Response } from 'express';
import {
    submitContactFormService,
    getAllContactMessagesService,
    getContactMessageByIdService,
    deleteContactMessageService,
} from '../services/contact.service';

export const ContactController = {
    submit: async (req: Request, res: Response) => {
        try {
            const { name, email, phone, message } = req.body as any;

            if (!name || !email || !phone || !message) {
                return res.status(400).json({
                    message: 'All fields are required',
                });
            }

            const contact = await submitContactFormService({
                name,
                email,
                phone,
                message,
            });

            return res.status(201).json({
                message: 'Message submitted successfully',
                contact,
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const messages = await getAllContactMessagesService();
            return res.json({
                message: 'Contact messages fetched',
                messages,
                count: messages.length,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Failed to fetch messages',
            });
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params as any;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const message = await getContactMessageByIdService(id);
            return res.json({
                message: 'Contact message fetched',
                contact: message,
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params as any;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            await deleteContactMessageService(id);
            return res.json({
                message: 'Message deleted successfully',
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    },
};
