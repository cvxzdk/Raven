export class OpenAIProvider {
  constructor(client) {
    this.client = client;
    this.name = 'openai';
  }

  getModels() {
    return [
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
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
      throw new Error(`OpenAI API error: ${error.message}`);
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