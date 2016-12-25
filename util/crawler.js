const cheerio = require('cheerio');
const Promise = require('bluebird');
const winston = require('winston');
const get = require('superagent').get;

const categories = require('../config/category');
const transformAudienceNumber = require('./transformAudienceNumber');

function judgeDataAna(liveJson, name) {
    if (liveJson.length === 0) {
        winston.error(`${ name }数据解析失败`);
    }
}

function crawlLolForHuya(url) {
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
}

exports.quanmin = function(categoryPath) {
    const url = categories[categoryPath].quanmin;
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
};

exports.panda = function(categoryPath) {
    const url = categories[categoryPath].panda;
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
};

exports.douyu = function(categoryPath) {
    const url = categories[categoryPath].douyu;
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
};

exports.zhanqi = function(categoryPath) {
    const url = categories[categoryPath].zhanqi;
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
};

exports.huya = function(categoryPath) {
    const url = categories[categoryPath].huya;
    if (categoryPath === 'lol') {
        return crawlLolForHuya(url);
    }
    return new Promise((resolve, reject) => {
        get(url)
            .then(({text}) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('.game-live-item').each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('i.js-num')[0]).text();
                    liveJson.push({
                        title: $(ele.find('a.title')[0]).text(),
                        anchor: $(ele.find('i.nick')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('a.video-info img')[0]).attr('data-original'),
                        url: $(ele.find('a.video-info')).attr('href'),
                        platformIcon: '/images/icon3.png',
                    });
                });
                judgeDataAna(liveJson, '虎牙');
                resolve(liveJson);
            })
            .catch(reject);
    });
};

exports.longzhu = function(categoryPath) {
    const url = categories[categoryPath].longzhu;
    if (!url) {
        console.log(`全民tv没有${categoryPath}类目`);
        return [];
    }
    return new Promise((resolve, reject) => {
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
            .catch(reject);
    });
};
