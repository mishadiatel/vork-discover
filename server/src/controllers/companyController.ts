import {NextFunction, Request, Response} from 'express';
import {Types} from 'mongoose';
import Company from '../models/companyModel';
import catchError from '../utils/catchError';
import AppError from '../utils/AppError';

export const getCompanies = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const companies = await Company.find();
    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: companies
    });
});

export const getCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = await Company.findById(objId).populate('vacancies');
    if (!company) {
        return next(new AppError('Not found company with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const updateCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = await Company.findByIdAndUpdate(objId, req.body, {
        new: true,
        runValidators: true
    });
    if (!company) {
        return next(new AppError('Not found company with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const deleteCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = await Company.deleteOne({_id: objId});

    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const createCompany = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const company = await Company.create(req.body);
    res.status(201).json({
        status: 'success',
        data: company
    });
});