import { Botkit } from "botkit";
import { SlackAdapter, SlackEventMiddleware } from "botbuilder-adapter-slack";
import axios from "axios";

const adapter = new SlackAdapter({
    clientSigningSecret: process.env.SINGING_SECRET,
    botToken: process.env.BOT_TOKEN,
    // Single Teamモードでは不要なパラメータなのですが、型で必須と言われてしまうので仕方なく書いてます。
    redirectUri: ""
});
// Slackのイベントを受け取れるようにします。
adapter.use(new SlackEventMiddleware());

const controller = new Botkit({
    adapter: adapter,
});

controller.on("app_mention", async (bot, message) => {
    const msg = message.incoming_message.channelData.text;
    let data = msg.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    data = data.replace(/ /g, '');
    let num = Number(data);
    let a = "";
    console.log(`http://160.251.78.132/teams?team_count=${num}`);
    await axios.get(`http://160.251.78.132/teams?team_count=${num}`)
        .then(res => {
            const teams = res.data["teams"];
            a = teams;
        });
    await bot.reply(message, JSON.stringify(a));
});