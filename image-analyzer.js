require('dotenv').config();

const got = require('got');

const apiKey = process.env.IMAGGAAPIKEY;
const apiSecret = process.env.IMAGGAAPISECRET;

const imageUrl = 'https://twitter.com/JoulRiad/status/1407822530690392064/photo/1';
const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

(async () => {
    try {
        const response = await got(url, {username: apiKey, password: apiSecret});
        console.log(response.body);
    } catch (error) {
        console.log(error.response.body);
    }
})();