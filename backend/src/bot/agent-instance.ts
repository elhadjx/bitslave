import { Bot } from 'grammy';
// Note: This script is intended to be run inside the deployed Docker container.
// It receives configuration via environment variables provided by the orchestrator.

console.log('Starting standalone bot instance...');

const token = process.env.TELEGRAM_TOKEN;
const provider = process.env.LLM_PROVIDER;
const apiKey = process.env.LLM_API_KEY;
const skills = JSON.parse(process.env.SKILLS || '{}');

if (!token) {
  console.error('TELEGRAM_TOKEN is required. Exiting.');
  process.exit(1);
}

const bot = new Bot(token);

bot.command('start', (ctx) => {
  ctx.reply('Hello! I am your AI agent. How can I help you today?');
});

bot.on('message:text', async (ctx) => {
  const userMessage = ctx.message.text;
  console.log(`Received message: ${userMessage}`);
  
  // Placeholder: Integrate with the actual LLM provider here (OpenAI/Anthropic/DeepSeek)
  ctx.reply(`[${provider?.toUpperCase()}] I received your message: "${userMessage}".\nEnabled skills: ${Object.keys(skills).filter(k => skills[k]).join(', ')}`);
});

bot.start({
  onStart(botInfo) {
    console.log(`Bot initialized successfully as @${botInfo.username}`);
  },
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
