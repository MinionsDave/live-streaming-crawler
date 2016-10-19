const express = require('express');
const router = express.Router();

const liveCtrl = require('../controllers/live.controller.js');

router.get('/:categoryPath', liveCtrl.get);

router.get('/', liveCtrl.get);

module.exports = router;
