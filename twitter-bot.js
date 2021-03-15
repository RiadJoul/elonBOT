require("dotenv").config();


// elon Twitter ID = '44196397';

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
      'query': 'from:JoulRiad -is:retweet',
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
      throw new Error('Unsuccessful request');
  }
}

var current = new Date();
var Time = current.getHours() + ':' + current.getMinutes()

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
      // if it doesn't find any tweets
      if(e instanceof TypeError)
      console.error('Account Has no tweet  ' + Time);
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
      console.log(JSON.stringify(analysisResults, null, 2));
    })
    // error handler
    .catch(err => {
      console.log('error:', err);
    });
}

module.exports = main;