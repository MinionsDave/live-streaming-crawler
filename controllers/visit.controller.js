/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:20:20
 * @Last Modified by: Jax2000
 * @Last Modified time: 2017-02-01 14:02:34
 */
const moment = require('moment');
const winston = require('winston');
const request = require('superagent');
const Promise = require('bluebird');
const {wrap: async} = require('co');

const Visit = require('../models/visit.model');
const categories = require('../config/category');
const platforms = require('../config/platform');

function create(req, res, next) {
    next();

    /**
     * 这里url除了关于本站外主要是三种形式 => 表示分割后的数组
     * 1. '/' 表示默认显示所有平台的lol主播 => ['', '']
     * 2. '/category' 表示所有平台当前类目的直播 => ['', 'category']
     * 3. '/category/platform' 表示特定平台的特定类目 => ['', 'category', 'platform']
     * 所以这里数组的第二位就是类目，为空则为lol
     * 第三位为平台，为空则为全部
     */
    const arr = req.originalUrl.split('/');
    let category = categories[arr[1] || 'lol'];
    let platform = platforms[arr[2] || 'all'];
    if (arr[1] === 'author') {
        category = '关于本站';
    }
    if (!category || !platform) {

        // 类目或者平台都不存在，说明404，什么都不用做了
        return;
    } else {
        category = typeof category === 'object' ? category.name : category;
        platform = platform.name;
    }

    const ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'no';

    analysisIp(ip)
        .then(result => result)
        .catch(() => ({ip}))
        .then(result => {
            const visit = new Visit(Object.assign({
                category,
                platform,
                userAgent,
                isEngineSpider: userAgent.indexOf('spider') > -1,
            }, result));
            visit.save().catch(winston.error);
        });
}

/*
 * list visits data
 */
const index = async(function* (req, res, next) {
    const page = req.query.pageNo - 1;
    const limit = +req.query.pageSize;
    const options = {page, limit};
    res.json(yield {
        visits: Visit.list(options),
        totalCount: Visit.count(),
    });
});

/*
 * get visits count by period
 */
const getCountByPeriod = async(function* (req, res, next) {
    const period = req.params.period;
    const now = moment().valueOf();
    let startDate;
    let endDate;
    switch (period) {
        case 'today':
            startDate = moment().startOf('day').valueOf();
            endDate = now;
            break;
        case 'yesterday':
            startDate = moment().subtract(1, 'day').startOf('day').valueOf();
            endDate = moment().subtract(1, 'day').endOf('day').valueOf();
            break;
        case 'thisWeek':
            startDate = moment().startOf('week').valueOf();
            endDate = now;
            break;
        case 'lastWeek':
            startDate = moment().subtract(1, 'week').startOf('week').valueOf();
            endDate = moment().subtract(1, 'week').endOf('week').valueOf();
            break;
        case 'thisMonth':
            startDate = moment().startOf('month').valueOf();
            endDate = now;
            break;
        case 'lastMonth':
            startDate = moment().subtract(1, 'month').startOf('month').valueOf();
            endDate = moment().subtract(1, 'month').endOf('month').valueOf();
            break;
        case 'all':
            // insted of minimum
            startDate = moment('2000', 'YYYY').valueOf();
            endDate = now;
            break;
        default:
            winston.info(`invalid period: ${period}`);
            return res.status(400).end();
    }
    const count = yield Visit.periodCount(startDate, endDate);
    res.json({
        count,
    });
});

/*
 * group by field and get each sum
 */
const groupCounting = async(function* (req, res, next) {
    const field = req.params.field;
    let result = yield Visit.groupCountingByField(field);
    if (result.length === 1 && !result[0]._id) {
        winston.info(`invalid field: ${field}`);
        return res.status(400).end();
    }
    res.json(result);
});

/*
 * group by time periods get each count
 */
const groupCountingByPeriod = async(function* (req, res, next) {
    const data = (yield Visit.find({}, 'visitTime').sort({visitTime: 1}));
    let length = data.length;
    let result = [];
    let n = 0;
    let startDate = moment(data[0].visitTime).startOf('days').valueOf();
    result.push({
        timestamp: startDate,
        count: 0,
    });
    while (n < length - 1) {
        n++;
        if (data[n].visitTime > moment(result[result.length - 1].timestamp).add(1, 'd').valueOf()) {
            result.push({
                timestamp: moment(data[n].visitTime).startOf('days').valueOf(),
                count: 1,
            });
        } else {
            result[result.length - 1].count++;
        }
    }
    res.json(result);
});

/**
 * 通过淘宝api解析ip
 * 返回的对象 code不为0就为失败
 * @param {string} ip - ip地址
 * @return {Promise.<Object>}
 */
function analysisIp(ip) {
    return new Promise((resolve, reject) => {
        request
            .get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`)
            .then(({text}) => {
                const data = JSON.parse(text);
                if (data.code != 0) {
                    return reject();
                }
                resolve(data.data);
            })
            .catch(reject);
    });
}

module.exports = {create, index, getCountByPeriod, groupCounting};
