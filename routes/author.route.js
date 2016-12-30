const express = require('express');
const moment = require('moment');

const Visit = require('../models/visit.model');

const router = express.Router();

router.get('/', function(req, res, next) {
    Visit.count({
        visitTime: {
            $gt: moment().startOf('day').valueOf(),
            $lt: moment().endOf('day').valueOf(),
        },
    })
    .then(count => res.render('author', {
        count,
    }))
    .catch(next);
});

module.exports = router;
