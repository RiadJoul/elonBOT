require('dotenv').config();

// TELEGRAM BOT


function AlreadyExist(id) {
  connection.query("SELECT * FROM userData WHERE chatId = " + mysql.escape(id), function (err, result, fields) {
    if(result.length == 0)
    {
      console.log('false');
      console.log(result.length);
      return false;
    }
      return true; 
  });
}


// connecting to our database

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user:  'root',
  password:  '',
  database: 'elonbot'
});



process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.telegramtoken;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});



bot.onText(/\/start/, (msg) => {
    // 'msg' is the received Message from Telegram
  
    let chatId = msg.chat.id;
    // store the chatID in a database
      // check if the id already exists
     // connection.query("INSERT INTO userdata (chatId) VALUES (" + mysql.escape(chatId) + ")", function () {
     //   console.log('user signed up');
     // });
     console.log(chatId);
     bot.sendMessage(chatId,'congratulations! , You have signed up for Elon Bot');
});