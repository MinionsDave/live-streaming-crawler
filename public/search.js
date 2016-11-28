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
                const originalJson = JSON.parse(text).data.items;
                let liveJson = [];
                for(let item of originalJson) {
                    liveJson.push({
                        title: item.name,
                        audienceNumber: item.person_num,
                        snapshot: item.pictures.img,
                        url: `http://www.panda.tv/${item.roomid}`,
                        platformIcon: '/images/icon3.png'
                    });
                }
                console.log(liveJson);
                resolve(liveJson);
            })
            .catch(err => {
                console.log('熊猫tv搜索失败');
                console.log(err);
            });
    });
}

function searchHuya (keyword) {
    return new Promise(resolve => {
        const url = searchUrl.createHuyaSearchUrl(keyword);
        request
            .get(url)
            .then(({ text }) => {
                console.log(text);
                const originalJson = JSON.parse(text).data.items;
                let liveJson = [];
                for(let item of originalJson) {
                    liveJson.push({
                        title: item.name,
                        audienceNumber: item.person_num,
                        snapshot: item.pictures.img,
                        url: `http://www.panda.tv/${item.roomid}`,
                        platformIcon: '/images/icon3.png'
                    });
                }
                console.log(liveJson);
                resolve(liveJson);
            })
            .catch(err => {
                console.log('熊猫tv搜索失败');
                console.log(err);
            });
    });
}

searchHuya('%E8%9B%87%E5%93%A5');