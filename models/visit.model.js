/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:13:43
 * @Last Modified by: Jax2000
 * @Last Modified time: 2016-12-29 21:32:18
 */
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    ip: String,
    category: String,
    platform: String,
    visitTime: {type: Number, default: Date.now},
    userAgent: String,
    isEngineSpider: Boolean, // 是否为搜索引擎爬虫
    country: String,
    area: String, // 地区
    region: String, // 省份
    city: String,
    county: String, // 区
    isp: String,
});

VisitSchema.statics = {

    /**
     * list visit records
     * @param {Object} options
     * @return {Promise.<Array.<Object>>}
     */
    list: function(options) {
        const criteria = options.criteria || {};
        const page = options.page || 0;
        const limit = options.limit || 30;
        return this.find(criteria)
                    .sort({visitTime: -1})
                    .limit(limit)
                    .skip(limit * page)
                    .exec();
    },
};

module.exports = mongoose.model('Visit', VisitSchema);
