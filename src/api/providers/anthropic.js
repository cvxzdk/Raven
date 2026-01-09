export class AnthropicProvider {
  constructor(client) {
    this.client = client;
    this.name = 'anthropic';
  }

  getModels() {
    return [
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
      { id: 'claude-opus-4-1-20250514', name: 'Claude Opus 4.1' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    ];
  }

  async sendMessage({ model, messages, maxTokens = 4096, temperature = 0.7, stream = false }) {
    try {
      const response = await this.client.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: messages,
        stream: stream,
      });

      return response;
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  async streamMessage({ model, messages, maxTokens = 4096, temperature = 0.7 }, onChunk, onComplete, onError) {
    try {
      const stream = await this.client.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: messages,
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          onChunk(chunk.delta.text);
        }
      }

      onComplete();
    } catch (error) {
      onError(error);
    }
  }
}