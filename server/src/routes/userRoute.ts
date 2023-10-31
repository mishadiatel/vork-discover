import {Router} from 'express';
import {
    forgotPassword,
    login,
    protect,
    resetPassword,
    restrictTo,
    signup,
    updatePassword
} from '../controllers/authController';
import {getMe, getUser, updateCurrentUser} from '../controllers/userController';
import {getReviews} from '../controllers/reviewController';

const router = Router();


router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
router.get('/me/reviews', restrictTo('user'), getReviews);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe',
    // uploadUserPhoto,
    // resizeUserPhoto,
    updateCurrentUser
);


export default router;

