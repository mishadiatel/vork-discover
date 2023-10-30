import {Router} from 'express';
import {forgotPassword, login, protect, resetPassword, signup, updatePassword} from '../controllers/authController';
import {getMe, getUser, resizeUserPhoto, updateCurrentUser, uploadUserPhoto} from '../controllers/userController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe',
    uploadUserPhoto,
    resizeUserPhoto,
    updateCurrentUser
);


export default router;

