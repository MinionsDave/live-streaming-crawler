const router = require('express').Router();

const sessionCtrl = require('../controllers/session.controller');

router.post('/api/session', sessionCtrl.create);

module.exports = router;
