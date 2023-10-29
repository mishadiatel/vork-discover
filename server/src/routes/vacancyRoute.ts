import {Router} from 'express';
import {
    createVacancy, deactivateVacancy,
    deleteVacancy,
    getAllVacancies,
    getVacancyById,
    updateVacancy
} from '../controllers/vacancyController';
import {protect, restrictTo} from '../controllers/authController';
import reviewsRoute from './reviewsRoute';

const router = Router({mergeParams: true});

router.use('/:vacancyId', reviewsRoute)

router.route('/')
    .get(getAllVacancies)
    .post(protect, restrictTo('hr'), createVacancy);


router.route('/:id')
    .get(getVacancyById)
    .patch(protect, restrictTo('hr'), updateVacancy)
    .delete(protect, restrictTo('hr'), deleteVacancy);

router.route('/:id/deactivate')
    .patch(protect, restrictTo('hr'), deactivateVacancy);

export default router;