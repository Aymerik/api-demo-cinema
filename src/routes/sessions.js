const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/sessionsController');

router.use(auth);

router.get('/', controller.list);

router.post('/', controller.create);

module.exports = router;
