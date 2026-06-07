const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/usersController');

router.use(auth);

router.get('/', controller.list);

router.post('/', controller.create);

router.delete('/:id', controller.remove);

router.get('/me', controller.me);

router.put('/me/password', controller.changePassword);

module.exports = router;
