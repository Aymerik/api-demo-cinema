const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const controller = require('../controllers/filmsController');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

router.use(auth);

router.get('/', controller.list);

router.post('/', upload.single('poster'), controller.create);

module.exports = router;
