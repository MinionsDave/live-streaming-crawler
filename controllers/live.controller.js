const crawler = require('../util/crawler');
const join = require('bluebird').join;
const liveCategory = require('../config/liveCategory');

exports.get = function ({ params: { categoryPath = 'lol' }}, res, next) {
    let category = liveCategory[categoryPath];
    category.path = categoryPath;
    join(crawler.crawlHuya(categoryPath), crawler.crawlPandaTv(categoryPath), crawler.crawlDouyuTv(categoryPath), crawler.crawlZhanqiTv(categoryPath), crawler.crawlQuanminTv(categoryPath), crawler.crawlLongzhu(categoryPath))
        .then(jsonList => {
            let liveJson = [].concat(...jsonList);
            liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber);
            res.render('index', {
                category,
                liveJson: liveJson.slice(0, 150)
            });
        })
        .catch(next);
}