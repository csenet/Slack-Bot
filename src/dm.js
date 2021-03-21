"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var botkit_1 = require("botkit");
var botbuilder_adapter_slack_1 = require("botbuilder-adapter-slack");
var node_fetch_1 = require("node-fetch");
var adapter = new botbuilder_adapter_slack_1.SlackAdapter({
    clientSigningSecret: process.env.SINGING_SECRET,
    botToken: process.env.BOT_TOKEN,
    redirectUri: ""
});
adapter.use(new botbuilder_adapter_slack_1.SlackEventMiddleware());
var controller = new botkit_1.Botkit({
    adapter: adapter
});
var APIToken = process.env.BOT_TOKEN; // 自分でSlack Appを作成し、発行されたtokenに差し替えてください
// const sheetUrl = "https://docs.google.com/spreadsheets/d/*****/edit"; // Slack IDが記載された スプレッドシートのURLに差し替えてください
// const sheetName = SpreadsheetApp.openByUrl(sheetUrl).getSheetByName('シート1'); // 使用するシート名に差し替えてください
var infoCol = {
    "SlackID": "B",
    "content1": "C",
    "content2": "D",
    "content３": "E"
};
function main() {
    // const rowBegin = 2; // シートに合わせて変更してください
    // const rowEnd = 30; // シートに合わせて変更してください
    var APIMethodUrl = "https://slack.com/api/chat.postMessage";
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
function postMessage(APIMethodUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var output, contri, git_name, imPayload, imOptions, messagePayload, messageOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    git_name = 'tak-ka3';
                    imPayload = {
                        "token": process.env.BOT_TOKEN,
                        "user": "U01S44LLDEY"
                    };
                    imOptions = {
                        "method": "post",
                        "contentType": "application/x-www-form-urlencoded",
                        "payload": imPayload
                    };
                    return [4 /*yield*/, node_fetch_1["default"]('https://slack.com/api/im.open', imOptions)
                            .then(function (res) {
                            console.log(res);
                            messagePayload = {
                                "token": process.env.BOT_TOKEN,
                                "channel": res.channel.id,
                                "text": "テスト"
                            };
                        })];
                case 1:
                    _a.sent();
                    messageOptions = {
                        "method": "post",
                        "contentType": "application/x-www-form-urlencoded",
                        "payload": messagePayload
                    };
                    return [4 /*yield*/, node_fetch_1["default"]('https://slack.com/api/chat.postMessage', messageOptions)
                            .then(function (res) { return console.log(res); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
controller.on("app_mention", function (bot, message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Coming");
        main();
        return [2 /*return*/];
    });
}); });
