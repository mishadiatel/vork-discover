import multer from 'multer';
import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import {filterObj} from '../utils/filterObj';
import Review from '../models/reviewModel';
import {Types} from 'mongoose';
import Vacancy from '../models/vacancyModel';
import AppError from '../utils/AppError';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = `resume-${req.user.id}-${Date.now()}.${ext}`;
        req.file = file;
        req.file.filename = fileName;
        cb(null, fileName);
    }
});

const upload = multer({storage: storage});
export const uploadFile = upload.single('resumeFile');

export const createReview = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(req.body, 'aboutMe');
    filteredBody.resume = req.file ? `${req.protocol}://${req.get('host')}/resume/${req.file?.filename}` : undefined;
    filteredBody.user = req.user._id;

    filteredBody.vacancy = new Types.ObjectId(req.params.vacancyId);
    const newReview = await Review.create(filteredBody);
    res.status(200).json({
        status: 'success',
        data: newReview
    });

});

export const getVacancyReviews = catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.recruiterVacancies.find(vac => vac.id === req.params.vacancyId)) {
        return next(new AppError('You cant read reviews to not your vacancies', 500));
    }
    const id = new Types.ObjectId(req.params.vacancyId);
    const reviews = await Review.find({vacancy: id})
        .populate({
           path: 'user',
            select: 'firstName lastName email _id photo'
        })
        .select('-vacancy -__v')
    if (!reviews) {
        return next(new AppError('Not found vacancies with that id', 404));
    }
    console.log(reviews);
    res.status(200).json({
        status: 'success',
        data: reviews
    });

});