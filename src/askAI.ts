
/**
 * Ask a question to the Hugging Face Inference Providers API (meta-llama/Llama-3.1-8B-Instruct)
 * @param question The user's question (string)
 * @param apiKey Your Hugging Face API key (string)
 * @returns The AI's answer (string)
 */
export async function askAI(question: string, apiKey: string): Promise<string> {
  const endpoint = 'https://router.huggingface.co/v1/chat/completions';
  const model = 'meta-llama/Llama-3.1-8B-Instruct';
  const systemPrompt = 'You are a helpful health assistant. Answer the following question about blood pressure.';
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question }
  ];
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages }),
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
    // The model returns a choices array with message content
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    return 'Sorry, I could not answer that.';
  } catch (err) {
    console.error('askAI error:', err);
    return 'Error contacting AI API.';
  }
}
