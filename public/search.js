const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = require('superagent');

const searchUrl = require('../config/searchUrl');

function searchPanda (keyword) {
    return new Promise(resolve => {
        const url = searchUrl.createPandaSearchUrl(keyword);
        request
            .get(url)
            .then(({ text }) => {
                resolve(JSON.parse(text).items);
            })
            .catch(err => {
                console.log('熊猫tv搜索失败');
                console.log(err);
            });
    });
}

searchPanda('rookie');