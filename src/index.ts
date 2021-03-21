import { Botkit } from "botkit";
import { SlackAdapter, SlackEventMiddleware } from "botbuilder-adapter-slack";
import axios from "axios";
import fetch from "node-fetch";
const { App } = require('@slack/bolt');
const app = new App({
    token: process.env.BOT_TOKEN,
    signingSecret: process.env.SINGING_SECRET
});

const adapter = new SlackAdapter({
    clientSigningSecret: process.env.SINGING_SECRET,
    botToken: process.env.BOT_TOKEN,
    redirectUri: ""
});

adapter.use(new SlackEventMiddleware());

const controller = new Botkit({
    adapter: adapter,
});

controller.on("app_mention", async (bot, message) => {
    const msg = message.incoming_message.channelData.text;
    const userId = message.incoming_message.from.id;
    let data = msg.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    let output: any;
    let contri: any;
    if (data.match(/maketeam [1-9][0-9]*/)) {
        data = data.replace(/maketeam /g, '');
        let num = Number(data);
        output = "*チーム一覧*\n";
        console.log(num);
        await axios.get(`http://160.251.78.132/teams?team_members=${num}`)
            .then(res => {
                const teams = res.data["teams"];
                for (let i = 0; i < teams.length; i++) {
                    output += `[Team${i + 1}]\n`
                    for (let j = 0; j < teams[i].length; j++) {
                        output += `*${teams[i][j].name}*`
                        if (j != teams[i].length - 1) output += ', ';
                        (async () => {
                            let dmmsg = `あなたのチームはTeam${i + 1}に決定しました!\n`;
                            if (teams[i].length != 1) {
                                dmmsg += '一緒になったメンバーは，\n';
                                for (let s = 0; s < teams[i].length; s++) {
                                    if (s != j) {
                                        dmmsg += `*${teams[i][s].name}*\n`;
                                    }
                                }
                                dmmsg += `です！`
                            }
                            const result = await app.client.chat.postMessage({
                                token: process.env.BOT_TOKEN,
                                channel: `${teams[i][j].slack_id}`,
                                text: dmmsg
                            });
                            console.log(result)
                        })();
                    }
                    output += '\n';
                }
            })
            .catch(err => {
                output = "Error: サーバーエラーが発生しました";
            })
    } else if (data.match(/account \S+ \S+/)) {
        // data1にaccount名を格納
        data = data.replace(/account /g, '').split(' ');
        // data2にroleを格納
        let data2 = data[1];
        let data3 = data[2];
        let isOK: boolean = false;
        await axios.get(`http://160.251.78.132/users/${data2}/contributions`)
            .then(res => {
                const data = res.data["contributions"];
                contri = Number(data);
                isOK = true;
            })
            .catch(err => {
                output = "Error: GitHubのアカウント名が存在しません";
                bot.reply(message, output);
            });
        if (!isOK) return 0;
        await fetch("http://160.251.78.132/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
                account_name: data2,
                role: data3,
                contribution: contri,
                slack_id: userId
            })
        }).then(function (response) {
            // レスポンス結果
            console.log(response)
            output = "追加しました";
        }, function (error) {
            // エラー内容
            output = "Error: サーバーエラーが発生しました";
            console.error(error.message)
        });
    } else {
        output = "*コマンド一覧*\nmaketeam {1チームの人数)：チームリストを表示\naccount {GitHub UserName} {Role}：ユーザを登録"
    }
    await bot.reply(message, output);
});
