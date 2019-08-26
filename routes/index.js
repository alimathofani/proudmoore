var router = require('express').Router();
var jwt = require('jsonwebtoken');

router.use('/article', require('./articles'));
router.use('/user', require('./users'));
router.use('/', require('./auth'));

module.exports = router;