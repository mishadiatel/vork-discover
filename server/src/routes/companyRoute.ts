import {Router} from 'express';
import {
    createCompany,
    deleteCompanyById,
    getCompanies,
    getCompanyById,
    updateCompanyById
} from '../controllers/companyController';


const router = Router();

router.route('/')
    .get(getCompanies)
    .post(createCompany);
router.route('/:id')
    .get(getCompanyById)
    .patch(updateCompanyById)
    .delete(deleteCompanyById);


export default router;
