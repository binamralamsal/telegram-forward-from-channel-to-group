import { Bot } from "grammy";

const { BOT_TOKEN, CHANNEL_ID, GROUP_ID } = process.env;

if (!BOT_TOKEN || !CHANNEL_ID || !GROUP_ID) {
  console.error("BOT_TOKEN, CHANNEL_ID and GROUP_ID must be filled");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

bot.on("channel_post", async (ctx) => {
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

bot.start({
  onStart: () => console.log("Bot is running 🔥"),
});
