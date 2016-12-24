/*
 * @Author: Jax2000
 * @Date: 2016-12-24 16:13:43
 * @Last Modified by:   Jax2000
 * @Last Modified time: 2016-12-24 16:13:43
 */
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    ip: String,
    category: String,
    visitTime: Number,
    userAgent: String,
});

module.exports = mongoose.model('Visit', VisitSchema);
