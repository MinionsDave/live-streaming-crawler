/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:20:20
 * @Last Modified by: Jax2000
 * @Last Modified time: 2017-01-01 15:50:52
 */
const moment = require('moment');
const winston = require('winston');
const request = require('superagent');
const Promise = require('bluebird');

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
    let category;
    let platform;
    if (arr[1] === 'author') {
        category = '关于本站';
    } else if (!categories[arr[1] || 'lol']) {

        // 类目都不存在，说明404，什么都不用做了
        return;
    } else {
        category = categories[arr[1] || 'lol'].name;
        platform = platforms[arr[2] || 'all'].name;
    }

    const ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

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
function index(req, res, next) {
    const page = parseInt((req.query.page > 0 ? req.query.page : 1) - 1);
    const limit = parseInt(req.query.limit > 0 ? req.query.limit : 30);
    const options = {page, limit};
    Promise.join(Visit.list(options), Visit.count(), function(data, totalCount) {
        res.json({
            data,
            totalCount,
        });
    });
}

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

module.exports = {create, index};
