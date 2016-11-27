const cheerio = require('cheerio');
const Promise = require('bluebird');

let get = Promise.promisify(require('superagent').get);

function searchPanda (queryStr) {
    return new Promise(resolve => {
        const url = 'http://www.panda.tv/search?kw=' + queryStr;
        console.log(url);
        get(url)
            .then(({ text }) => {
                // console.log(text);
            })
            .catch(err => console.log(err));
    });
}

searchPanda('rookie');