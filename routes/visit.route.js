const express = require('express');

const visitCtrl = require('../controllers/visit.controller');

const router = express.Router();

router.get('/api/visits', visitCtrl.index);

router.get('/api/visits/count/:period', visitCtrl.getCountByPeriod);

router.get('/api/visits/groupInfo/:field', visitCtrl.groupCounting);

module.exports = router;
