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

/*
 * 返回的response对象中
 * 1的为相关主播
 * 3为进行中的直播
 * 122为相关视频
 */
function searchHuya (keyword) {
    return new Promise(resolve => {
        const url = searchUrl.createHuyaSearchUrl(keyword);
        console.log(url);
        request
            .get(url)
            .then(({ text }) => {
                const originalJson = JSON.parse(text).response;
                console.log(originalJson);
                let liveJson = [];
                // for(let item of originalJson) {
                //     liveJson.push({
                //         title: item.name,
                //         audienceNumber: item.person_num,
                //         snapshot: item.pictures.img,
                //         url: `http://www.panda.tv/${item.roomid}`,
                //         platformIcon: '/images/icon3.png'
                //     });
                // }
                // console.log(liveJson);
                resolve(liveJson);
            })
            .catch(err => {
                console.log('虎牙tv搜索失败');
                console.log(err);
            });
    });
}

function searchDouyu (keyword) {
    return new Promise(resolve => {
        const url = searchUrl.createDouyuSearchUrl(keyword);
        request
            .get(url)
            .then(({ text }) => {
                let $ = cheerio.load(text),
                    liveJson = [];
                $('#search-room-list a').each((idx, ele) => {
                    ele = $(ele);
                    // if (ele.find('i.icon_live')) {
                        liveJson.push({
                            title: ele.attr('title'),
                            anchor: $(ele.find('h3.ellipsis')[0]).text(),
                            audienceNumber: $(ele.find('.dy-num')[0]).text()
                        })
                    // }
                });
                console.log(liveJson);

            })
            .catch(err => {
                console.log('斗鱼tv搜索失败');
                console.log(err);
            });
    })
}

searchDouyu('赵信');