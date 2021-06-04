const twitterBot = require('./twitter-bot');
console.log('client is Ready!');

// making a request every 30 seconds
setInterval(twitterBot, 30000);
