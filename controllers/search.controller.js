/*
 * @Author: Jax2000
 * @Date: 2016-12-25 15:41:10
 * @Last Modified by:   Jax2000
 * @Last Modified time: 2016-12-25 15:41:10
 */
const search = require('../util/search');
const Promise = require('bluebird');

function searchAll({query: {keyword}}, res, next) {
    if (!keyword) {
        return next();
    }
    let liveJson = [];
    Promise.map(Object.keys(search), prop => search[prop](keyword).reflect())
        .each(inspection => {
            liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
        })
        .then(() => liveJson.sort((o1, o2) => {
            if (o1.onlineFlag !== o2.onlineFlag) {
                return o2.onlineFlag ? 1 : -1;
            }
            return o2.audienceNumber - o1.audienceNumber;
        }))
        .then(() => res.render('index', {
            liveJson,
            keyword,
        }));
}

module.exports = {searchAll};
