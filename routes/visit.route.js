const express = require('express');

const visitCtrl = require('../controllers/visit.controller');

const router = express.Router();

router.get('/api/visits', visitCtrl.index);

module.exports = router;
