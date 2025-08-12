import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { GoogleGenerativeAI } from '@google/generative-ai';
import authMiddleware from '../middlewares/authMiddleware';

export const aiRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        GEMINI_API_KEY: string;
    };

    Variables: {
        userId: string;
    };
}>();

aiRouter.post('/generate-article', authMiddleware, async (c) => {
    try {
        const userId = c.get('userId');
        if (!userId) {
            c.status(401);
            return c.json({ message: 'Unauthorized. No user ID found.' });
        }

        const body = await c.req.json();
        const { title, category } = body;

        // Validate input
        if (!title || !category) {
            c.status(400);
            return c.json({ message: 'Title and category are required.' });
        }

        // Check if API key is configured
        if (!c.env.GEMINI_API_KEY) {
            c.status(500);
            return c.json({ message: 'AI service is not configured.' });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Write a comprehensive, engaging blog article with the title "${title}" in the category "${category}". 

Requirements:
- Write in a professional yet conversational tone
- Include an introduction, main content with 3-4 sections, and a conclusion
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li> tags
- Make it informative and valuable for readers
- Keep it between 800-1200 words
- Include relevant examples and practical insights
- End with a compelling conclusion

Please format the response as clean HTML that can be directly used in a rich text editor.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedContent = response.text();

        // Clean up the response and ensure it's properly formatted
        const cleanedContent = generatedContent
            .replace(/```html/g, '')
            .replace(/```/g, '')
            .trim();

        c.status(200);
        return c.json({
            success: true,
            content: cleanedContent,
            message: 'Article generated successfully'
        });

    } catch (error: any) {
        console.error('Error generating article:', error);
        
        // Handle specific error types
        if (error.message?.includes('overloaded') || error.message?.includes('503')) {
            c.status(503);
            return c.json({ 
                success: false,
                message: 'AI service is temporarily busy. Please try again in a few minutes.' 
            });
        } else if (error.message?.includes('API key') || error.message?.includes('401')) {
            c.status(500);
            return c.json({ 
                success: false,
                message: 'AI service configuration error. Please contact support.' 
            });
        } else if (error.message?.includes('quota')) {
            c.status(429);
            return c.json({ 
                success: false,
                message: 'AI service quota exceeded. Please try again later.' 
            });
        } else {
            c.status(500);
            return c.json({ 
                success: false,
                message: 'Failed to generate article. Please try again later.' 
            });
        }
    }
});
