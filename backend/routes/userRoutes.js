const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.put('/change-password/:id', userController.changePassword);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserDetails);
router.get('/:id/reviews', userController.getReviewsForUser);
router.put('/:id/role', userController.updateUserRole);


module.exports = router;