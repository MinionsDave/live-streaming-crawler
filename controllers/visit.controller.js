/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:20:20
 * @Last Modified by: Jax2000
 * @Last Modified time: 2016-12-24 16:35:52
 */

const Visit = require('../models/visit.model');
const moment = require('moment');
const winston = require('winston');

function create(req, res, next) {
    next();
    const visit = new Visit({
        ip: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress,
        category: req.url,
        visitTime: moment().valueOf(),
        userAgent: req.headers['user-agent'],
    });
    visit.save().catch(winston.error);
}

module.exports = {create};
