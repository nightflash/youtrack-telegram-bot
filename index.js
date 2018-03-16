const YTBot = require('node-telegram-bot-api');
const persist = require('node-persist');

const config = require('./config.json');
const Storage = require('./storage');

persist.initSync();

const storage = new Storage(persist.set, persist.get);

// Create a bot that uses 'polling' to fetch new updates
const bot = new YTBot(config.telegramToken, {polling: true});

bot.onText(/\/listservers/, async msg => {
  const servers = await storage.listServers(msg.from.id);

  bot.sendMessage(msg.chat.id, servers.length === 0 ?
      'You have no added servers, please call /addserver [url] [permanentToken]' :
      servers.map(s => `${s.url}, token: ${s.token}`).join('\n'));
});

// addserver [host] [permanentToken]
bot.onText(/\/addserver (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1] && match[1].trim();
  const permanentToken = match[2] && match[2].trim();

  if (url && permanentToken) {
    await storage.addServer(msg.from.id, url, permanentToken);
    bot.sendMessage(chatId, `Done!`);
  } else {
    bot.sendMessage(chatId, `Wrong command, you should provide two arguments [url] and [permanentToken]`);
  }
});
