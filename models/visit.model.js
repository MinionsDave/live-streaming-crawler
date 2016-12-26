/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:13:43
 * @Last Modified by: Jax2000
 * @Last Modified time: 2016-12-26 22:04:46
 */
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    ip: String,
    category: String,
    platform: String,
    visitTime: Number,
    userAgent: String,
    isEngineSpider: Boolean, // 是否为搜索引擎爬虫
    country: String,
    area: String, // 地区
    region: String, // 省份
    city: String,
    county: String, // 区
    isp: String,
});

module.exports = mongoose.model('Visit', VisitSchema);
