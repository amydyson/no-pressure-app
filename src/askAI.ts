// Utility to call Hugging Face Inference API for Q&A/chat
// Usage: import { askAI } from './askAI';
// await askAI('What is high blood pressure?', 'YOUR_HF_API_KEY');

/**
 * Ask a question to the Hugging Face Inference API (google/flan-t5-base)
 * @param question The user's question (string)
 * @param apiKey Your Hugging Face API key (string)
 * @returns The AI's answer (string)
 */
export async function askAI(question: string, apiKey: string): Promise<string> {
  // Q&A model expects { question, context }
  const endpoint = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';
  // For demo, use a fixed context. In production, you would use a real medical context or FAQ.
  const context = `Blood pressure is the pressure of circulating blood on the walls of blood vessels. High blood pressure (hypertension) increases the risk of heart disease and stroke. Normal blood pressure is below 120/80 mmHg.`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: { question, context } }),
    });
    const data = await response.json();
    // Debug: log the full response
    console.log('HuggingFace API response:', data);
    if (!response.ok) {
      if (data.error) {
        return `API error: ${data.error}`;
      }
      return 'AI API error (non-200 response)';
    }
    // The model returns { answer, score, ... }
    if (data.answer) {
      return data.answer.trim();
    }
    return 'Sorry, I could not answer that.';
  } catch (err) {
    console.error('askAI error:', err);
    return 'Error contacting AI API.';
  }
}
