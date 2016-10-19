const cheerio = require('cheerio');
const Promise = require('bluebird');

let get = Promise.promisify(require('superagent').get);

function transformAudienceNumber (text) {
    return text.indexOf('万') > 0 ? text.replace(/万/, '') * 10000 : text;
}

exports.crawlPandaTv = function () {
    return new Promise(resolve => {
        get('http://www.panda.tv/cate/lol')
            .then(({ text }) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('.video-list-item-wrap').each((idx, ele) => {
                    ele = $(ele);
                    liveJson.push({
                        title: $(ele.find('.video-title')[0]).attr('title'),
                        anchor: $(ele.find('.video-nickname')[0]).text(),
                        audienceNumber: $(ele.find('.video-number')[0]).text(),
                        snapshot: $(ele.find('.video-img-lazy')[0]).attr('data-original'),
                        url: 'http://www.panda.tv' + ele.attr('href')
                    });
                });
                resolve(liveJson);
            })
            .catch(err => {
                console.log('熊猫tv获取失败');
                resolve([]);
            });
    });
};

exports.crawlDouyuTv = function () {
    return new Promise(resolve => {
        get('https://www.douyu.com/directory/game/LOL')
            .then(({ text }) => {
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
                        url: 'https://www.douyu.com' + ele.attr('href')
                    });
                });
                resolve(liveJson);
            })
            .catch(err => {
                console.log('斗鱼tv获取失败');
                resolve([]);
            });
    });
};

exports.crawlZhanqiTv = function () {
    return new Promise(resolve => {
        get('https://www.zhanqi.tv/games/lol')
            .then(({ text }) => {
                let liveJson = [];
                let $ = cheerio.load(text);
                $('.clearfix.js-room-list-ul a').each((idx, ele) => {
                    ele = $(ele);
                    let audienceText = $(ele.find('span.views span.dv')[0]).text();
                    liveJson.push({
                        title: $(ele.find('.info-area>span.name')[0]).text(),
                        anchor: $(ele.find('.anchor.anchor-to-cut.dv')[0]).text(),
                        audienceNumber: transformAudienceNumber(audienceText),
                        snapshot: $(ele.find('.imgBox img')[0]).attr('src'),
                        url: 'https://www.zhanqi.tv' + ele.attr('href')
                    });
                });
                resolve(liveJson);
            })
            .catch(err => {
                console.log('获取战旗tv失败');
                resolve([]);
            });
    });
};

exports.crawlHuya = function () {
    return new Promise(resolve => {
        get('http://www.huya.com/cache.php?m=Game&do=ajaxGameLiveByPage&gid=1&page=1')
            .then(({ text }) => {
                let liveJson = [];
                for (item of JSON.parse(text).data.list) {
                    liveJson.push({
                        title: item.introduction,
                        anchor: item.nick,
                        audienceNumber: item.totalCount,
                        snapshot: item.screenshot,
                        url: 'http://www.huya.com/' + item.privateHost
                    });
                }
                resolve(liveJson);
            })
            .catch(err => {
                console.log('虎牙tv获取失败');
                resolve([]);
            });
    });
};
