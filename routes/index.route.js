const express = require('express');
const router = express.Router();

const liveCtrl = require('../controllers/live.controller');
const searchCtrl = require('../controllers/search.controller');

router.get('/:categoryPath', liveCtrl.get);

router.get('/:categoryPath/:platform', liveCtrl.getOne);

router.get('/search', searchCtrl.searchAll);

router.get('/', liveCtrl.get);

module.exports = router;
