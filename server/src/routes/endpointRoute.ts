import {Router} from 'express';
import {getAllEndpoints, getOneEndpoint} from '../controllers/endpointController';

const router = Router();

router.route('/').get(getAllEndpoints);
router.route('/:id').get(getOneEndpoint);

export default router;