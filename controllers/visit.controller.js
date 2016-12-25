/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:20:20
 * @Last Modified by: Jax2000
 * @Last Modified time: 2016-12-25 22:15:13
 */
const moment = require('moment');
const winston = require('winston');

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

        // 类目都不存在，说明404
        return;
    } else {
        category = categories[arr[1] || 'lol'].name;
        platform = platforms[arr[2] || 'all'].name;
    }
    const visit = new Visit({
        ip: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress,
        category,
        platform,
        visitTime: moment().valueOf(),
        userAgent: req.headers['user-agent'],
    });

    visit.save().catch(winston.error);
}

module.exports = {create};
