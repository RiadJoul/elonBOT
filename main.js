const twitterBot = require('./twitter-bot');
console.log('client is Ready!');

// making a request every 20 seconds
setInterval(twitterBot, 5000);
