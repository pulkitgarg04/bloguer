import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateArticle(title: string, category: string) {
    if (!process.env.GEMINI_API_KEY)
        return { error: 'AI service is not configured.' };
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Write a blog article titled "${title}" under the category "${category}".

The article should feel personal, warm, and thoughtfully written rather than templated.

Guidelines:
- Choose a natural structure (classic, story-led, problem - solution, or guide-style)
- Use between 2 and 5 main sections as appropriate
- Vary the introduction style (question, story, insight, or conversational opening)
- Maintain a professional tone with natural voice variation
- Use HTML formatting (<h2>, <h3>, <p>, <ul>, <li>) organically
- Include real-world examples or practical insights where relevant
- Vary paragraph and section lengths
- Avoid formulaic transitions or repetitive phrasing
- End with a natural closing (reflection, takeaway, question, or forward-looking thought)

Length: 800-1200 words  
Output clean HTML suitable for a rich text editor.`;
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

export async function refineArticle(content: string, title: string) {
    if (!process.env.GEMINI_API_KEY)
        return { error: 'AI service is not configured.' };
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Refine and improve the following blog article titled "${title}".

Original content:
${content}

Guidelines:
- Improve clarity, flow, and readability
- Fix grammar and spelling errors
- Enhance sentence structure and word choice
- Maintain the original tone and key ideas
- Keep existing HTML formatting (<h2>, <h3>, <p>, <ul>, <li>)
- Make the content more engaging and professional
- Preserve the article's length (don't make it significantly longer or shorter)

Output the refined HTML content suitable for a rich text editor.`;
    const result = await model.generateContent(prompt);
    console.log('AI Refinement Result:', result);
    const response = await result.response;
    const refinedContent = response.text();
    const cleanedContent = refinedContent
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

    return { content: cleanedContent };
}
