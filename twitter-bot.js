require("dotenv").config();

// 1tter API
const needle = require('needle');

const BearerToken = process.env.BEARERTOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

var tweet = '';

async function getRequest() {

  // Edit query parameters below
  // specify a search query, and any additional fields that are required
  // by default, only the Tweet ID and text fields are returned
  const params = {
      'query': 'from: JoulRiad',
      'tweet.fields': 'author_id',
      'max_results' : 5
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
          console.log(tweet);
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
      console.log(analysisResults);
      map(res,analyzeParams.text);
    })
    // error handler
    .catch(err => {
      console.log('error:', err);
    });
}
// ------------------------------- 


process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.telegramtoken;

const id = '-412485763';

let sendMessage = false;

let aboutCrypto = false;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

function sendTelegram(message) {
      bot.sendMessage(id,message);
      sendMessage = false;
      aboutCrypto = false;
}


/// To Do map
function map(json,text) {
  var response = {
    "category" : '',
    "cryptocurrency" : '',
    "state" : '', // postive or negative
    "accuracy" : '',
  };

  let message;

  response.state = json.result.sentiment.document.label;

  if(json.result.categories[0].label === '/finance/investing'
    || json.result.categories[0].label === '/finance/investing/beginning investing')
    {
      // check if message is about cryptocurrency
      sendMessage = true;
    }

  
  if(json.result.sentiment.document.score < 0)
  {response.accuracy = Math.round(json.result.sentiment.document.score * -1)}
  else{
    response.accuracy = Math.round(json.result.sentiment.document.score);
  }
  if(text.includes('Bitcoin')){response.cryptocurrency = 'Bitcoin';aboutCrypto = true; sendMessage = true;}
  if(text.includes('Doge')){response.cryptocurrency = 'Dogecoin';aboutCrypto = true; sendMessage = true;}
  if(text.includes('Dogecoin')){response.cryptocurrency = 'Dogecoin';aboutCrypto = true; sendMessage = true;}
  if(text.includes('litecoin')){response.cryptocurrency = 'litecoin';aboutCrypto = true;sendMessage = true;}
  if(text.includes('cardano')){response.cryptocurrency = 'cardano';aboutCrypto = true;sendMessage = true;}

  if(response.state == 'neutral'){message = "Elon Musk just tweeted about " + response.cryptocurrency +  " our results shown that the message is " +response.state;}
  else{
    message = "Elon Musk just tweeted about " + response.cryptocurrency +  " our results shown that the message is " +response.state  + '   ' +  'TWEET : ' + text;
  }

  if(sendMessage == true){sendTelegram(message);}

  
   console.log(response);
   console.log(message);
   console.log(aboutCrypto);
   console.log(sendMessage);
}


module.exports = main;