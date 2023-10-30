import {Router} from 'express';
import {protect, restrictTo} from '../controllers/authController';
import {createReview, getVacancyReviews, rejectReview, uploadFile} from '../controllers/reviewController';

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
    );

router.patch('/reviews/:reviewId/reject',
    protect,
    restrictTo('hr'),
    rejectReview
);


export default router;