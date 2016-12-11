const cheerio = require('cheerio');
const Promise = require('bluebird');

const LiveCategory = require('../config/liveCategory');
const transformAudienceNumber = require('./transformAudienceNumber');

let get = Promise.promisify(require('superagent').get);

function judgeDataAna(liveJson, name) {
    if (liveJson.length === 0) {
        console.log(`${ name }数据解析失败`);
    }
}

function crawlLolForHuya(url) {
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                for (let item of JSON.parse(text).data.list) {
                    liveJson.push({
                        title: item.introduction,
                        anchor: item.nick,
                        audienceNumber: item.totalCount,
                        snapshot: item.screenshot,
                        url: 'http://www.huya.com/' + item.privateHost,
                        platformIcon: '/images/icon3.png',
                    });
                }
                judgeDataAna(liveJson, '虎牙');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('虎牙tv获取失败');
                resolve([]);
            });
    });
}

exports.crawlQuanminTv = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForQuanmin;
    if (!url) {
        console.log(`全民tv没有${categoryPath}类目`);
        return [];
    }
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                for (let item of JSON.parse(text).data) {
                    liveJson.push({
                        title: item.title,
                        anchor: item.nick,
                        audienceNumber: item.view,
                        snapshot: item.thumb,
                        url: 'http://www.quanmin.tv/v/' + item.uid,
                        platformIcon: '/images/icon5.png',
                    });
                }
                judgeDataAna(liveJson, '全民');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('全民获取失败');
                resolve([]);
            });
    });
};

exports.crawlPandaTv = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForPanda;
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('.video-list-item-wrap').each((idx, ele) => {
                    ele = $(ele);
                    liveJson.push({
                        title: $(ele.find('.video-title')[0]).attr('title'),
                        anchor: $(ele.find('.video-nickname')[0]).text(),
                        audienceNumber: $(ele.find('.video-number')[0]).text(),
                        snapshot: $(ele.find('.video-img-lazy')[0]).attr('data-original'),
                        url: 'http://www.panda.tv' + ele.attr('href'),
                        platformIcon: '/images/icon0.png',
                    });
                });
                judgeDataAna(liveJson, '熊猫tv');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('熊猫tv获取失败');
                resolve([]);
            });
    });
};

exports.crawlDouyuTv = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForDouyu;
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('#live-list-content li a').each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('.dy-num')[0]).text();
                    liveJson.push({
                        title: ele.attr('title'),
                        anchor: $(ele.find('.dy-name')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('.imgbox img')[0]).attr('data-original'),
                        url: 'https://www.douyu.com' + ele.attr('href'),
                        platformIcon: '/images/icon1.png',
                    });
                });
                judgeDataAna(liveJson, '斗鱼tv');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('斗鱼tv获取失败');
                resolve([]);
            });
    });
};

exports.crawlZhanqiTv = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForZhanqi;
    if (!url) {
        console.log(`战旗tv没有${categoryPath}类目`);
        return [];
    }
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                let $gameDomList = $('.clearfix.gameList a');
                if ($gameDomList.length === 0) {
                    $gameDomList = $('.clearfix.js-room-list-ul a');
                }
                $gameDomList.each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('span.views span.dv')[0]).text();
                    liveJson.push({
                        title: $(ele.find('.info-area>span.name')[0]).text(),
                        anchor: $(ele.find('.anchor.anchor-to-cut.dv')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('.imgBox img')[0]).attr('src'),
                        url: 'https://www.zhanqi.tv' + ele.attr('href'),
                        platformIcon: '/images/icon2.png',
                    });
                });
                judgeDataAna(liveJson, '战旗tv');
                resolve(liveJson);
            })
            .catch((err) => {
                resolve([]);
            });
    });
};

exports.crawlHuya = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForHuya;
    if (categoryPath === 'lol') {
        return crawlLolForHuya(url);
    }
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('.video-list .video-list-item').each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('i.js-num')[0]).text();
                    liveJson.push({
                        title: $(ele.find('.all_live_tit a')[0]).text(),
                        anchor: $(ele.find('i.nick')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('a.video-info img')[0]).attr('src'),
                        url: $(ele.find('a.video-info')).attr('href'),
                        platformIcon: '/images/icon3.png',
                    });
                });
                judgeDataAna(liveJson, '虎牙');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('虎牙获取失败');
                resolve([]);
            });
    });
};

exports.crawlLongzhu = function(categoryPath) {
    const url = LiveCategory[categoryPath].urlForLongzhu;
    if (!url) {
        console.log(`全民tv没有${categoryPath}类目`);
        return [];
    }
    return new Promise((resolve) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('#list-con .livecard').each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('.livecard-meta-views .livecard-meta-item-text')[0]).text();
                    liveJson.push({
                        title: $(ele.find('h3')[0]).text(),
                        anchor: $(ele.find('.livecard-modal-username')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('.livecard-thumb')[0]).attr('src'),
                        url: ele.attr('href'),
                        platformIcon: '/images/icon6.png',
                    });
                });
                judgeDataAna(liveJson, '龙珠');
                resolve(liveJson);
            })
            .catch((err) => {
                console.log('龙珠获取失败');
                resolve([]);
            });
    });
};
