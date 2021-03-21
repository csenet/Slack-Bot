const { App } = require('@slack/bolt')
const app = new App({
    token: process.env.BOT_TOKEN,
    signingSecret: process.env.SINGING_SECRET
});
(async () => {
    const result = await app.client.chat.postMessage({
        token: process.env.BOT_TOKEN,
        channel: "U01S44LLDEY",
        text: 'hello world'
    });
    console.log(result)
})();