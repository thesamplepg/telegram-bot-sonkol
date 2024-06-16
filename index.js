const fs = require("fs");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require("body-parser");
const cors = require("cors");

const botToken = "6801956381:AAH-io6hIwSk58aKb0ODdgcAlTzEIMfPrDE";

const app = express();
const bot = new TelegramBot(botToken, { polling: true });

app.use(bodyParser.json());
app.use(cors());

let dataBase = require("./chats.json");

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);

  console.log(chatId);

  if (!dataBase.chats.includes(chatId)) {
    dataBase.chats.push(chatId);
    fs.writeFileSync("chats.json", JSON.stringify(dataBase));
  }
});

const sendToAllChats = (message) => {
  dataBase.chats.forEach((chatId) => {
    bot.sendMessage(chatId, message);
  });
};

app.post("/", (req, res) => {
  const keys = Object.keys(req.body);
  let data = "";

  keys.forEach((key) => {
    data += `${key}: ${req.body[key]}` + "\n";
  });

  sendToAllChats(data);

  res.json({
    message: "success",
  });
});

app.listen(process.env.PORT || 5000, (err) => {
  if (err) return console.log(err);
  console.log("Start");
});
