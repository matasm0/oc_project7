const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/auth/signup', userCtrl.signup);
router.post('/auth/login', userCtrl.login);

router.get('/users/get', userCtrl.getUsers);
router.get('/users/get/:id', userCtrl.getUserId);
router.post('/users/likePost/:id', userCtrl.addLikeDislikePost);
router.post('/users/createPost/:id', auth, userCtrl.createPost);
router.delete('/users/deletePost/:id', auth, userCtrl.deletePost);
router.post('/users/createComment/:id', auth, userCtrl.createComment);
router.delete('/users/deleteComment/:id', auth, userCtrl.deleteComment);
router.post('/users/likeComment/:id', userCtrl.addLikeDislikeComment);
router.post('/users/readPost/:id', userCtrl.readPost);
router.put('/users/update/:id', auth, multer, userCtrl.updateUser);
router.put('/users/delete/:id', auth, userCtrl.deleteUser);

router.post('/posts/create', auth, multer, postCtrl.postPost);
router.get('/posts/get', postCtrl.getPosts);
router.get('/posts/get/:id', postCtrl.getPostId);
router.delete('/posts/delete/:id', auth, postCtrl.deletePost);
router.post('/posts/like/:id', postCtrl.addLikeDislike);

router.get('/comments/get', commentCtrl.getComments);
router.post('/comments/create', auth, commentCtrl.postComment);
router.get('/posts/comments/:postId', commentCtrl.getCommentsPost);
router.put('/comments/edit/:id', auth, commentCtrl.updateComment);
router.delete('/comments/delete/:id', auth, commentCtrl.deleteComment);
router.post('/comments/like/:id', commentCtrl.addLikeDislike);

module.exports = router;