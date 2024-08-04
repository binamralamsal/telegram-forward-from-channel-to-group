import "dotenv/config";

import { Bot, webhookCallback } from "grammy";
import express from "express";
import type { Request, Response } from "express";

const { BOT_TOKEN, CHANNEL_ID, GROUP_ID } = process.env;

if (!BOT_TOKEN || !CHANNEL_ID || !GROUP_ID) {
  console.error("BOT_TOKEN, CHANNEL_ID, and GROUP_ID must be filled");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Hello"));

bot.on("channel_post", async (ctx) => {
  console.log(ctx);
  if (ctx.chat && ctx.chat.id === parseInt(CHANNEL_ID)) {
    try {
      await ctx.copyMessage(GROUP_ID);
      console.log(
        `Forwarded message ${ctx.msg.message_id} from channel to group`
      );
    } catch (error) {
      console.error(`Failed to forward message: ${error}`);
    }
  } else {
    console.log(`Message from another channel: ${ctx.chat?.username}`);
  }
});

async function run() {
  await bot.api.setWebhook(
    "https://telegram-forward-from-channel-to-group.vercel.app/"
  );
}

run();

const app = express();
app.use(express.json());
app.use(webhookCallback(bot, "express"));

app.get("/", (req: Request, res: Response) => {
  res.send("Bot is running!");
});

export default app;
