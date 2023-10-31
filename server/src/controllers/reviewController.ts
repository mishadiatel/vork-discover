import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import {filterObj} from '../utils/filterObj';
import Review from '../models/reviewModel';
import {Types} from 'mongoose';
import AppError from '../utils/AppError';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `resume-${req.user.id}-${Date.now()}.${ext}`;
//         req.file = file;
//         req.file.filename = fileName;
//         cb(null, fileName);
//     }
// });
//
// const upload = multer({storage: storage});
// export const uploadFile = upload.single('resumeFile');

export const createReview = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(req.body, 'aboutMe');
    // filteredBody.resume = req.file ? req.file?.filename : undefined;
    filteredBody.user = req.user._id;

    filteredBody.vacancy = new Types.ObjectId(req.params.vacancyId);
    const newReview = await Review.create(filteredBody);
    res.status(200).json({
        status: 'success',
        data: newReview
    });

});

export const getReviews = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const isHr = req.user.role === 'hr';
    if (isHr && !req.user.recruiterVacancies.find(vac => vac.id === req.params.vacancyId)) {
        return next(new AppError('You cant read reviews to not your vacancies', 500));
    }
    let queryFilter: any = {user: req.user._id};
    if(isHr && req.params.vacancyId) {
        queryFilter = {vacancy: new Types.ObjectId(req.params.vacancyId)};
    }

    const reviews = await Review.find(queryFilter)
        .populate({
            path: 'user',
            select: 'firstName lastName email _id photo additionalInfo'
        })
        .populate('vacancy')
        .select('-__v')
        .sort('-createdAt');
    if (!reviews) {
        return next(new AppError('Not found review ', 404));
    }
    // console.log(reviews);
    res.status(200).json({
        status: 'success',
        data: reviews
    });

});

export const rejectReview = catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.recruiterVacancies.find(vac => vac.id === req.params.vacancyId)) {
        return next(new AppError('You cant reject reviews to not your vacancies', 500));
    }
    // const vacancyId = new Types.ObjectId(req.params.vacancyId);
    const reviewId = new Types.ObjectId(req.params.reviewId);
    const review = await Review.findByIdAndUpdate(
        reviewId,
        {rejected: true},
        {new: true, runValidators: true});
    if (!review) {
        return next(new AppError('Not found review with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: review
    });

});