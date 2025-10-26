import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateArticle(title: string, category: string) {
    if (!process.env.GEMINI_API_KEY)
        return { error: 'AI service is not configured.' };
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
    console.log('AI Generation Result:', result); 
    const response = await result.response;
    const generatedContent = response.text();
    const cleanedContent = generatedContent
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

    return { content: cleanedContent };
}
