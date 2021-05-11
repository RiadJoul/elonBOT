require("dotenv").config();



// Twitter API
const needle = require('needle');

const BearerToken = process.env.BEARERTOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

var tweet = '';

async function getRequest() {

  // Edit query parameters below
  // specify a search query, and any additional fields that are required
  // by default, only the Tweet ID and text fields are returned
  const params = {
      'query': 'from:elonmusk -is:retweet',
      'tweet.fields': 'author_id',
  }

  const res = await needle('get', endpointUrl, params, {
      headers: {
          "User-Agent": "v2RecentSearchJS",
          "authorization": `Bearer ${BearerToken}`
      }
  })

  if (res.body) {
      return res.body;
  } else {
      throw new Error('Unsuccssful requests');
  }
}

var current = new Date();
var Time = current.getHours() + ':' + current.getMinutes();

async function main(){
  try {
      // Make request
      const response = await getRequest();
       if(response.data[0].text != tweet){
          tweet = response.data[0].text;
          AnalyzeText(tweet);
        }
        else{
          console.log('==> checking for new Tweet...' + Time);
        }
  } catch (e) {
      // if it doesn't find any tweets]
      if(e instanceof TypeError)
      console.error('Account Has no tweet ' + Time);
      else{
        console.log(e);
      }
    
  }
};
  console.log("Starting the twitter bot ...");
  console.log('==> checking for new Tweet...' + Time);
// -------------------------------------------

// IBM text analysis api
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBMAPIKEY,
  }),
  serviceUrl: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/03db8ca4-f445-4697-bf80-64081dd29ec1',
});
// parameters you want to recieve back form the response in our case : ElonBot
  // keywords(to see if the tweets is talking about bitcoin)
 //  emotion/sentiment(to see if he's talking about it in a positive way or not)
var analyzeParams = [];


function AnalyzeText(text){
    analyzeParams = {
        'text': text,
        'features': { 
          'sentiment':{
            'document':{
              'score': true,
              'label': true
            }
          },
          'entities': {
            'emotion': true,
            'sentiment': true,
            'limit': 2,
          },
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 2,
          },
          'categories': {
            'score': true,
            'label': true
          }
        },
    };
    fetchApi();
    console.log(' 🤖 NEW TWEET : ' + text + ' ' + Time);
}

function fetchApi(){
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
      analysisResults = JSON.stringify(analysisResults, null, 2);
      var res = JSON.parse(analysisResults);
      map(res,analyzeParams.text);
    })
    // error handler
    .catch(err => {
      console.log('error:', err);
    });
}
// ------------------------------- 

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

function sendTelegram(message) {
  connection.query('SELECT * FROM userdata', function(err, rows, fields) {
    if (err) {throw err};
      for (var i = 0; i < rows.length; i++) {
      bot.sendMessage(rows[i].chatId,message);
    }
  })
}

/// To Do map
function map(json,text) {
  var response = {
    "category" : '',
    "cryptocurrency" : '',
    "state" : '', // postive or negative
    "accuracy" : '',
  };
  response.state = json.result.sentiment.document.label;
  if(json.result.sentiment.document.score < 0)
  {response.accuracy = json.result.sentiment.document.score * -1}
  else{
    response.accuracy = json.result.sentiment.document.score;
  }
  if(text.includes('Bitcoin')){response.cryptocurrency = 'Bitcoin'}
  if(text.includes('Doge')){response.cryptocurrency = 'Dogecoin'}
  if(text.includes('Dogecoin')){response.cryptocurrency = 'Dogecoin'}
  if(text.includes('litecoin')){response.cryptocurrency = 'litecoin'}
  if(text.includes('cardano')){response.cryptocurrency = 'cardano'}



// crypto
   let message = "Elon Musk just tweeted about " + response.cryptocurrency +  " our results shown that the message is " + (response.accuracy * 100) + "%  " + response.state;
   sendTelegram(message);
}

module.exports = main;
