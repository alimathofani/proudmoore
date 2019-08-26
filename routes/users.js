var express = require('express');
var router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/', userController.index);
router.post('/', userController.create);
router.get('/:id', userController.show);
router.patch('/:id', userController.update);
router.delete('/:id', userController.destroy);


module.exports = router;
