const express = require('express');
const count = require('../util/visitCount');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('author', {
        count: count.get()
    });
});

module.exports = router;