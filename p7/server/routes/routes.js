const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

// const multer = require('../middleware/multer-config');
// const auth = require('../middleware/auth');

router.post('/auth/signup', userCtrl.signup);
router.post('/auth/login', userCtrl.login);

// router.get('/', sauceCtrl.getSauces);
// router.get('/:id', sauceCtrl.getOneSauce);
// router.post('/', auth, multer, sauceCtrl.postSauce);
// router.put('/:id', auth, multer, sauceCtrl.updateSauce);
// router.delete('/:id', auth, sauceCtrl.deleteSauce);
// router.post('/:id/like', auth, sauceCtrl.likeDislike);

router.post('/posts/create', postCtrl.postPost);
router.get('/posts/get', postCtrl.getPosts);

router.post('/comments/create', commentCtrl.postComment)
router.get('/posts/comments/:postId', commentCtrl.getCommentsPost)

module.exports = router;