export class GroqProvider {
  constructor(client) {
    this.client = client;
    this.name = 'groq';
  }

  getModels() {
    return [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    ];
  }

  async sendMessage({ model, messages, maxTokens = 4096, temperature = 0.7, stream = false }) {
    try {
      const response = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: stream,
      });

      return response;
    } catch (error) {
      throw new Error(`Groq API error: ${error.message}`);
    }
  }

  async streamMessage({ model, messages, maxTokens = 4096, temperature = 0.7 }, onChunk, onComplete, onError) {
    try {
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }

      onComplete();
    } catch (error) {
      onError(error);
    }
  }
}