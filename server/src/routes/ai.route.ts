import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import authMiddleware from '../middlewares/authMiddleware';

export const aiRouter = Router();

aiRouter.post('/generate-article', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized. No user ID found.' });

    const body = req.body;
    const { title, category } = body;

    if (!title || !category) return res.status(400).json({ message: 'Title and category are required.' });

    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ message: 'AI service is not configured.' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

    const cleanedContent = generatedContent.replace(/```html/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ success: true, content: cleanedContent, message: 'Article generated successfully' });
  } catch (error: any) {
    console.error('Error generating article:', error);

    if (error.message?.includes('overloaded') || error.message?.includes('503')) {
      return res.status(503).json({ success: false, message: 'AI service is temporarily busy. Please try again in a few minutes.' });
    } else if (error.message?.includes('API key') || error.message?.includes('401')) {
      return res.status(500).json({ success: false, message: 'AI service configuration error. Please contact support.' });
    } else if (error.message?.includes('quota')) {
      return res.status(429).json({ success: false, message: 'AI service quota exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to generate article. Please try again later.' });
    }
  }
});
