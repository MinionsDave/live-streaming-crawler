/*
 * @Author: Jax2000
 * @Date: 2016-12-25 15:41:32
 * @Last Modified by:   Jax2000
 * @Last Modified time: 2016-12-25 15:41:32
 */
const Promise = require('bluebird');

const crawler = require('../util/crawler');
const categories = require('../config/category');

exports.get = function({params: {categoryPath = 'lol'}}, res, next) {
    let category = categories[categoryPath];
    let liveJson = [];
    if (!category) {
        return next();
    }
    Promise.map(Object.keys(crawler), prop => crawler[prop](categoryPath).reflect())
        .each(inspection => {
            liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
        })
        .then(() => liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber))
        .then(() => res.render('index', {
            category: Object.assign({
                path: categoryPath,
            }),
            liveJson: liveJson.slice(0, 150),
        }))
        .catch(next);
};

exports.getOne = function({params: {categoryPath, platform}}, res, next) {
    let category = categories[categoryPath];
    if (!category || !crawler[platform] || !category[platform]) {
        return next();
    }
    crawler[platform](categoryPath)
        .then((list) => {
            list.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber);
            res.render('index', {
                category: Object.assign({
                    path: categoryPath,
                    platform,
                }, category),
                liveJson: list.slice(0, 150),
            });
        })
        .catch(next);
};
