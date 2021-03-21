import { Botkit } from "botkit";
import { SlackAdapter, SlackEventMiddleware } from "botbuilder-adapter-slack";
import axios from "axios";
import fetch from "fetch";

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
                        output += `*${teams[i][j]}*`
                        if (j != teams[i].length - 1) output += ', ';
                    }
                    output += '\n';
                }
            })
            .catch(err => {
                output = "Error";
            })
    } else if (data.match(/account /)) {
        // data1にaccount名を格納
        data = data.replace(/account /g, '').split(' ');
        let data1 = data[0];
        // data2にroleを格納
        let data2 = data[1];
        let data3 = data[3];
        await axios.get(`http://160.251.78.132/users/${data2}/contributions`)
            .then(res => {
                const data = res.data["contributions"];
                contri = Number(data)
            })
            .catch(err => {
                output = "Error";
            })
        await axios.post("http://160.251.78.132/users", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
                account_name: data1,
                role: data3,
                contribution: contri
            })
        }).then(function (response) {
            // レスポンス結果
            console.log(response)
        }, function (error) {
            // エラー内容
            console.error(error.message)
        });
    } else {
        output = "*コマンド一覧*\nmaketeam {1チームの人数)：チームリストを表示\n"
    }
    await bot.reply(message, output);
});
