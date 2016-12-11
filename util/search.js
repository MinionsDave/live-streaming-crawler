const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = require('superagent');
const nativeRequest = Promise.promisify(require('request'));

const searchUrl = require('../config/searchUrl');
const transformAudienceNumber = require('./transformAudienceNumber');

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

/**
 * 搜索虎牙的方法
 * 返回的对象中
 * 1为匹配到的主播, gameLiveOn 代表是否正在直播
 * 3为正在进行的直播，目前就展示全部正在直播的
 * 122为视频，暂时没用
 * 1024和20251为空，不知道干什么的
 * 搜索失败会直接resolve空数组
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
function searchHuya(keyword) {
    return new Promise((resolve) => {
        request
            .get(searchUrl.createHuyaSearchUrl(keyword))
            .then(({text}) => {
                resolve(JSON.parse(text).response['3'].docs.map((item) => ({
                    title: item.game_introduction,
                    audienceNumber: item.game_total_count,
                    snapshot: item.game_screenshot,
                    url: `http://www.huya.com/${item.game_privateHost}`,
                    platformIcon: '/images/icon3.png',
                    anchor: item.game_nick,
                    category: item.gameName,
                    onlineFlag: true,
                })));
            })
            .catch((err) => {
                console.log('虎牙tv搜索失败');
                console.log(err);
                resolve([]);
            });
    });
}

/**
 * 搜索斗鱼的方法
 * 直接返回html页面
 * 如果页面中对应元素带有正在直播的标签则为正在直播
 * 搜索失败会直接resolve空数组
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
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
                    liveJson.push({
                        title: ele.attr('title'),
                        audienceNumber: transformAudienceNumber($(ele.find('.dy-num')[0]).text()),
                        snapshot: $(ele.find('.imgbox img')[0]).attr('src'),
                        url: 'https://www.douyu.com' + ele.attr('href'),
                        platformIcon: '/images/icon1.png',
                        anchor: $(ele.find('h3.ellipsis')[0]).text(),
                        category: $(ele.find('.tag')[0]).text(),
                        onlineFlag: Boolean($(ele.find('.icon_live')).length),
                    });
                });
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('斗鱼tv搜索失败');
                console.log(err);
                resolve([]);
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

searchDouyu('皇子').then(console.log);
