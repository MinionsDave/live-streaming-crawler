const crawler = require('../util/crawler');
const join = require('bluebird').join;

exports.get = function ({ params: { categoryPath = 'lol' }}, res, next) {
    join(crawler.crawlHuya(categoryPath), crawler.crawlPandaTv(categoryPath), crawler.crawlDouyuTv(categoryPath), crawler.crawlZhanqiTv(categoryPath))
        .then(jsonList => {
            let liveJson = [].concat(...jsonList);
            liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber);
            res.render('index', {
                title: 'Express',
                liveJson: liveJson
            });
        })
        .catch(next);
}