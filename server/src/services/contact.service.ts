import {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    deleteContactMessage,
} from '../repositories/contact.repository';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export async function submitContactFormService(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
}) {
    const { name, email, phone, message } = data;

    if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
    }

    if (!email || !emailRegex.test(email)) {
        throw new Error('Invalid email address');
    }

    if (!phone || !phoneRegex.test(phone)) {
        throw new Error('Invalid phone number');
    }

    if (!message || message.trim().length < 10) {
        throw new Error('Message must be at least 10 characters long');
    }

    if (message.length > 1000) {
        throw new Error('Message cannot exceed 1000 characters');
    }

    return createContactMessage({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        message: message.trim(),
    });
}

export async function getAllContactMessagesService() {
    return getAllContactMessages();
}

export async function getContactMessageByIdService(id: string) {
    const message = await getContactMessageById(id);
    if (!message) {
        throw new Error('Message not found');
    }
    return message;
}

export async function deleteContactMessageService(id: string) {
    const existing = await getContactMessageById(id);
    if (!existing) {
        throw new Error('Message not found');
    }
    return deleteContactMessage(id);
}
