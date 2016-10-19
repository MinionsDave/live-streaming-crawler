const express = require('express');
const router = express.Router();
const crawler = require('../util/crawler');
const join = require('bluebird').join;

/* GET home page. */
router.get('/', function(req, res, next) {
    join(crawler.crawlHuya(), crawler.crawlPandaTv(), crawler.crawlDouyuTv(), crawler.crawlZhanqiTv())
    .then(jsonList => {
        let liveJson = [].concat(...jsonList);
        liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber);
        res.render('index', {
            title: 'Express',
            liveJson: liveJson
        });
    })
    .catch(next);
});

module.exports = router;
