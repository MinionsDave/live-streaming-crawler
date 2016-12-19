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
    return new Promise((resolve, reject) => {
        request
            .get(searchUrl.createPandaSearchUrl(keyword))
            .then(({text}) => {
                resolve(JSON.parse(text).data.items.map((item) => ({
                    title: item.name,
                    audienceNumber: item.person_num,
                    snapshot: item.pictures.img,
                    url: `http://www.panda.tv/${item.roomid}`,
                    platformIcon: '/images/icon0.png',
                    anchor: item.nickname,
                    category: item.classification,
                    onlineFlag: item.reliable == 1,
                })));
            })
            .catch(reject);
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
    return new Promise((resolve, reject) => {
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
            .catch(reject);
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
    return new Promise((resolve, reject) => {
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
                        snapshot: $(ele.find('.imgbox img')[0]).attr('data-original'),
                        url: 'https://www.douyu.com' + ele.attr('href'),
                        platformIcon: '/images/icon1.png',
                        anchor: $(ele.find('h3.ellipsis')[0]).text(),
                        category: $(ele.find('.tag')[0]).text(),
                        onlineFlag: Boolean($(ele.find('.icon_live')).length),
                    });
                });
                resolve(liveJson);
            })
            .catch(reject);
    });
}

/**
 * 搜索全民的方法
 * play_status为true时正在直播
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
function searchQuanmin(keyword) {
    return new Promise((resolve, reject) => {
        request
            .post(searchUrl.createQuanminSearchUrl())
            .send({
                p: {
                    categoryId: 0,
                    key: keyword,
                    page: 0,
                    size: 40,
                },
            })
            .then(({text}) => {
                resolve(JSON.parse(text).data.items.map((item) => ({
                    title: item.title,
                    audienceNumber: item.view,
                    snapshot: item.thumb,
                    url: 'http://www.quanmin.tv/v/' + item.uid,
                    platformIcon: '/images/icon5.png',
                    anchor: item.nick,
                    category: item.category_name,
                    onlineFlag: item.play_status,
                })));
            })
            .catch(reject);
    });
}

/**
 * 搜索龙珠的方法
 * live字段为其直播信息
 * live.isLive 表示是否正在直播
 * 有点缺陷就是没有直播截图
 * 因为不知道为什么用superagent获取不了，所以用了request
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
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
    return new Promise((resolve, reject) => {
        nativeRequest(options)
            .then(({body}) => {
                resolve(JSON.parse(body).items.map((item) => ({
                    title: item.live.title,
                    audienceNumber: item.live.onlineCount,
                    // snapshot: item.game_screenshot,
                    url: `http://star.longzhu.com/${item.live.url}`,
                    platformIcon: '/images/icon6.png',
                    anchor: item.name,
                    category: item.gameName,
                    onlineFlag: item.live.isLive,
                })));
            })
            .catch(reject);
    });
}

/**
 * 搜索战旗的方法
 * 没有明确的是否在线标志
 * 估计是人数等于0则是在线
 *
 * @async
 * @param {string} keyword - 搜索的关键字
 * @return {Promise.<Array.<Object>>}
*/
function searchZhanqi(keyword) {
    return new Promise((resolve, reject) => {
        request
            .get(searchUrl.createZhanqiSearchUrl(keyword))
            .then(({text}) => {
                let $ = cheerio.load(text);
                let liveJson = [];
                $('a.js-jump-link').each((idx, ele) => {
                    ele = $(ele);
                    const audienceNumber = transformAudienceNumber($(ele.find('.meat span.dv')[0]).text());
                    liveJson.push({
                        title: $(ele.find('p.room-name')[0]).text(),
                        anchor: $(ele.find('.anchor')[0]).text(),
                        audienceNumber,
                        snapshot: $(ele.find('.img-box img')[0]).attr('src'),
                        url: 'https://www.zhanqi.tv' + ele.attr('href'),
                        platformIcon: '/images/icon2.png',
                        category: $(ele.find('p.name')[0]).text(),
                        onlineFlag: audienceNumber > 0,
                    });
                });
                resolve(liveJson);
            })
            .catch(reject);
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
