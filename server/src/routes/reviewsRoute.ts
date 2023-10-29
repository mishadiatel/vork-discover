import {Router} from 'express';
import {protect, restrictTo} from '../controllers/authController';
import {createReview, getVacancyReviews, uploadFile} from '../controllers/reviewController';

const router = Router({mergeParams: true});

router.route('/reviews')
    .post(
        protect,
        restrictTo('user'),
        uploadFile,
        createReview
    )
    .get(
        protect,
        restrictTo('hr'),
        getVacancyReviews
        )


export default router;