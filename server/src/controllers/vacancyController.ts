import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import Vacancy from '../models/vacancyModel';
import {Types} from 'mongoose';
import AppError from '../utils/AppError';

export const createVacancy = catchError(async (req: Request, res: Response, next: NextFunction) => {
    req.body.recruiter = req.user._id;
    console.log(req.user);
    const newVacancy = await Vacancy.create(req.body);
    res.status(200).json({
        status: 'success',
        data: newVacancy
    });
});

export const getAllVacancies = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const endpointsToFilter: string[] = req.body.endpoints;
    let queryCondition = {};
    queryCondition = endpointsToFilter && endpointsToFilter.length > 0 && {endpoints: {$in: endpointsToFilter}};
    const vacancies = await Vacancy
        .find({active: true, ...queryCondition})
        .sort('-createdAt');
    res.status(200).json({
        status: 'success',
        results: vacancies.length,
        data: vacancies
    });
});

export const getVacancyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const vacancy = await Vacancy.findById(new Types.ObjectId(req.params.id));
    if (!vacancy) return next(new AppError('Not found vacancy with that ID.', 404));
    res.status(200).json({
        status: 'success',
        data: vacancy
    });
});

export const updateVacancy = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = new Types.ObjectId(req.params.id);
    if (!req.user.recruiterVacancies.find(vac => vac.id === req.params.id)) {
        return next(new AppError('You cant update not your vacancies', 500));
    }
    const vacancy = await Vacancy.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    if (!vacancy) return next(new AppError('Not found vacancy with that ID.', 404));
    res.status(200).json({
        status: 'success',
        data: vacancy
    });
});

export const deactivateVacancy = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = new Types.ObjectId(req.params.id);
    if (!req.user.recruiterVacancies.find(vac => vac.id === req.params.id)) {
        return next(new AppError('You cant update not your vacancies', 500));
    }
    const vacancy = await Vacancy.findByIdAndUpdate(id, {active: false});
    if (!vacancy) return next(new AppError('Not found vacancy with that ID.', 404));
    res.status(200).json({
        status: 'success',
        data: vacancy
    });
});

export const deleteVacancy = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = new Types.ObjectId(req.params.id);
    if (!req.user.recruiterVacancies.find(vac => vac.id === req.params.id)) {
        return next(new AppError('You cant update not your vacancies', 500));
    }
    const vacancy = await Vacancy.deleteOne({_id: id});
    if (!vacancy) return next(new AppError('Not found vacancy with that ID.', 404));
    res.status(200).json({
        status: 'success',
        data: vacancy
    });
});