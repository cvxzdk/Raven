# 🪶 Raven

<p align="center">terminal-based AI chat interface.</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-orange?style=flat-square" />
</p>

---

<p align="center">
  <img src="packages/demo.gif" alt="Raven Demo" width="800" />
</p>

---

### Installation

```bash
# Clone and link locally
git clone https://github.com/yourusername/raven.git

# Navigate to raven's dir 
cd raven

# Install dependencies
npm install

## Option 1: Run directly with Node
node cli.js chat

## Option 2: Install globally and use anywhere
# Link the package globally
npm link

# Now you can run it from anywhere in your terminal
raven chat
```

To unlink later if needed:
```bash
npm unlink -g raven
```

> [!TIP]
> Make sure you have Node.js 18+ installed before running.


### Configuration

```bash
# Set provider
raven config set provider anthropic

# Set model
raven config set model claude-sonnet-4-5

# Set API keys
raven config set anthropic_api_key sk-ant-xxx
raven config set openai_api_key sk-xxx
raven config set groq_api_key gsk-xxx

```

### Supported Providers

Raven works with multiple AI providers out of the box. Switch between them anytime.

- **Anthropic** - Claude Sonnet 4.5, Claude Opus 4...
- **OpenAI** - GPT-4, GPT-4 Turbo, GPT-3.5 Turbo...
- **Groq** - Llama 3.1 70B, openai/gpt-oss-120b...
