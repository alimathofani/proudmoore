require('dotenv').config();
var express = require('express');
var multer  = require('multer');
const checkAuth = require('../app/middleware/checkAuth');
const validateFormat = require('../app/middleware/validateFormat');
var router = express.Router();

// Controller 
const articleController = require('../app/controllers/ArticleController');
const anyController = require('../app/controllers/AnyController');

const accepted_extensions = ['jpg', 'png', 'gif'];
var imageArticle = multer({ 
  dest: 'public/uploads/articles/',
  limits: { 
    fileSize: 50 * 1024 * 1024,  // 5 MB upload limit
    files: 1                    // 1 file
  },
  fileFilter: (req, file, cb) => {
    // if the file extension is in our accepted list
    if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
        return cb(null, true);
    }
    // otherwise, return error
    console.log('Only ' + accepted_extensions.join(", ") + ' files are allowed!');
    return cb('Only ' + accepted_extensions.join(", ") + ' files are allowed!');
  }
});


router.get('/', articleController.index);
router.get('/:id', articleController.show);
router.post('/', checkAuth, imageArticle.single('image'), validateFormat, articleController.create);
router.patch('/:id', checkAuth, imageArticle.single('image'), validateFormat, articleController.update);
router.delete('/:id', checkAuth, articleController.destroy);

router.get('/public/uploads/articles/:id', anyController.index);


module.exports = router;
