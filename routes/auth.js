var express = require('express');
var router = express.Router();

const userController = require('../app/controllers/UserController');

router.post('/register', userController.create);
router.post('/login', userController.authenticate);

module.exports = router;