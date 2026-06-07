const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/genresController');

router.use(auth);

router.get('/', controller.list);

module.exports = router;
