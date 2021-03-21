import { Botkit } from "botkit";
import { SlackAdapter, SlackEventMiddleware } from "botbuilder-adapter-slack";
import fetch from 'node-fetch'
import axios from "axios";
const adapter = new SlackAdapter({
  clientSigningSecret: process.env.SINGING_SECRET,
  botToken: process.env.BOT_TOKEN,
  redirectUri: ""
});

adapter.use(new SlackEventMiddleware());

const controller = new Botkit({
  adapter: adapter,
});
const APIToken = process.env.BOT_TOKEN; // 自分でSlack Appを作成し、発行されたtokenに差し替えてください
// const sheetUrl = "https://docs.google.com/spreadsheets/d/*****/edit"; // Slack IDが記載された スプレッドシートのURLに差し替えてください
// const sheetName = SpreadsheetApp.openByUrl(sheetUrl).getSheetByName('シート1'); // 使用するシート名に差し替えてください
const infoCol = {
  "SlackID": "B", // DMを送る相手のIDが記載された列
  "content1": "C", // 送る内容が記載された列
  "content2": "D",
  "content３": "E"
}

function main() {
  // const rowBegin = 2; // シートに合わせて変更してください
  // const rowEnd = 30; // シートに合わせて変更してください
  const APIMethodUrl = "https://slack.com/api/chat.postMessage";
  postMessage(APIMethodUrl);
}

// function getUserID(row) {
//   let userID = sheetName.getRange(infoCol.SlackID + row).getValue();

//   return userID;
// }

// function createMessage(row) {
//   let msgContent1 = sheetName.getRange(infoCol.content1 + row).getValue();
//   let msgContent2 = sheetName.getRange(infoCol.content2 + row).getValue();
//   let message = ("content1: " + msgContent1 + "\ncontent2: " + content2 + "\ncontent3: " + content3);
//   return message;
// }

async function postMessage(APIMethodUrl) {
  let output: any;
  let contri: any;
  let git_name = 'tak-ka3'
  // await axios.get(`http://160.251.78.132/users/`)
  //   .then(res => {
  //     const data = res.data["contributions"];
  //     contri = Number(data);
  //   })
  //   .catch(err => {
  //     output = "Error: GitHubのアカウント名が存在しません";
  //   });
  // let userID = getUserID(row);

  // if (userID == "")
  //   continue;
  var imPayload = {
    "token": process.env.BOT_TOKEN,　//必要なスコープはbot・im:write
    "user": "U01S44LLDEY",
  };

  var imOptions = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload": imPayload
  };
  var messagePayload;
  await fetch('https://slack.com/api/im.open', imOptions)
    .then(res => {
      console.log(res);
      messagePayload = {
        "token": process.env.BOT_TOKEN,　//必要なスコープはbot・chat:write:user・chat:write:bot
        "channel": res.channel.id,
        "text": "テスト"
      };
    })

  var messageOptions = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload": messagePayload
  };

  await fetch('https://slack.com/api/chat.postMessage', messageOptions)
    .then((res) => console.log(res))
}
controller.on("app_mention", async (bot, message) => {
  console.log("Coming");
  main();
});
