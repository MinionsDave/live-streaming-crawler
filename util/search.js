const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = require('superagent');
const nativeRequest = Promise.promisify(require('request'));

const searchUrl = require('../config/searchUrl');

/**
 * 搜索熊猫tv的方法
 * 返回的reliable为1表示正在直播
 * 2表示没在直播
 * 搜索失败会直接resolve空数组
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
function searchPanda(keyword) {
    return new Promise((resolve) => {
        request
            .get(searchUrl.createPandaSearchUrl(keyword))
            .then(({text}) => {
                resolve(JSON.parse(text).data.items.map((item) => ({
                    title: item.name,
                    audienceNumber: item.person_num,
                    snapshot: item.pictures.img,
                    url: `http://www.panda.tv/${item.roomid}`,
                    platformIcon: '/images/icon3.png',
                    anchor: item.nickname,
                    category: item.classification,
                    onlineFlag: item.reliable == 1,
                })));
            })
            .catch((err) => {
                console.log('熊猫tv搜索失败');
                console.log(err);
                resolve([]);
            });
    });
}

/*
 * 返回的response对象中
 * 1的为相关主播
 * 3为进行中的直播
 * 122为相关视频
 */
function searchHuya(keyword) {
    return new Promise((resolve) => {
        const url = searchUrl.createHuyaSearchUrl(keyword);
        console.log(url);
        request
            .get(url)
            .then(({text}) => {
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
            .catch((err) => {
                console.log('虎牙tv搜索失败');
                console.log(err);
            });
    });
}

function searchDouyu(keyword) {
    return new Promise((resolve) => {
        const url = searchUrl.createDouyuSearchUrl(keyword);
        request
            .get(url)
            .then(({text}) => {
                let $ = cheerio.load(text);
                let liveJson = [];
                $('#search-room-list a').each((idx, ele) => {
                    ele = $(ele);
                    // if (ele.find('i.icon_live')) {
                        liveJson.push({
                            title: ele.attr('title'),
                            anchor: $(ele.find('h3.ellipsis')[0]).text(),
                            audienceNumber: $(ele.find('.dy-num')[0]).text(),
                        });
                    // }
                });
                console.log(liveJson);
            })
            .catch((err) => {
                console.log('斗鱼tv搜索失败');
                console.log(err);
            });
    });
}

/*
 * 返回的json对象中
 * play_status为true的为正在直播
 * play_status为false的没在直播
*/
function searchQuanmin(keyword) {
    return new Promise((resolve) => {
        const url = searchUrl.createQuanminSearchUrl();
        console.log(url);
        request
            .post(url)
            .send({
                p: {
                    categoryId: 0,
                    key: keyword,
                    page: 0,
                    size: 40,
                },
            })
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(({text}) => {
                const originalJson = JSON.parse(text).data.items;
            })
            .catch((err) => {
                console.log('全民tv搜索失败');
                console.log(err);
            });
    });
}

function searchLongzhu(keyword) {
    const options = {
        method: 'GET',
        url: searchUrl.createLongzhuSearchUrl(),
        qs: {
            title: keyword,
            from: 'tga',
            sortStr: 'relate',
            pageIndex: '0',
            pageSize: '16',
        },
    };
    nativeRequest(options)
        .then(({body}) => {
            // console.log(JSON.parse(body).items);
            const originJson = JSON.parse(body).items;
            console.log(originJson);
        })
        .catch((err) => {
            console.log(err);
            console.log('龙珠tv获取失败');
        });
}

/*
 * 这个是否在直播没有明显的标志
 * 估计观众为0的就是没有在直播
 * 大于0的就是在直播的
*/
function searchZhanqi(keyword) {
    return new Promise((resolve) => {
        const url = searchUrl.createZhanqiSearchUrl(keyword);
        request
            .get(url)
            .then(({text}) => {
                let $ = cheerio.load(text);
                let liveJson = [];
                $('a.js-jump-link').each((idx, ele) => {
                    ele = $(ele);
                    liveJson.push({
                        title: $(ele.find('p.room-name')[0]).text(),
                        anchor: $(ele.find('.anchor')[0]).text(),
                        audienceNumber: $(ele.find('.meat span.dv')[0]).text(),
                        snapshot: $(ele.find('.img-box img')[0]).attr('src'),
                        url: 'https://www.zhanqi.tv' + ele.attr('href'),
                        platformIcon: '/images/icon2.png',
                    });
                });
                console.log(liveJson);
            })
            .catch((err) => {
                console.log('战旗tv搜索失败');
                console.log(err);
            });
    });
}

module.exports = {
    searchPanda,
    searchHuya,
    searchDouyu,
    searchQuanmin,
    searchLongzhu,
    searchZhanqi,
};

searchPanda('957').then(console.log);
