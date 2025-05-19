import { GoogleGenAI } from '@google/genai';

export async function generateContent(prompt, retries = 3, delay = 1000) {
    if (!prompt) {
        throw new Error('Prompt is required');
    }
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const ai = new GoogleGenAI({
        apiKey,
    });

    const config = {
        responseMimeType: "application/json",
    };

    const model = 'gemini-1.5-flash';

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];

    try {
        const response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        let resultText = '';
        for await (const chunk of response) {
            resultText += chunk.text;
        }
        return resultText;
    } catch (error) {
        // Check if error is 503 Service Unavailable and retry if retries left
        if (error?.code === 503 && retries > 0) {
            console.warn(`Received 503 error, retrying in ${delay}ms... Retries left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateContent(prompt, retries - 1, delay * 2);
        }
        console.error('Error generating content:', error);
        throw error;
    }
}
