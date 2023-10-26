import {NextFunction, Request, Response} from 'express';
import {addCompany, deleteCompany, getAllCompanies, getCompany, updateCompany} from '../services/company.service';
import {Types} from 'mongoose';
import catchError from '../utils/catchError';
import AppError from '../utils/AppError';

export const getCompanies = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const companies = await getAllCompanies();
    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: companies
    });
});

export const getCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = await getCompany(objId);
    if (!company) {
        return next(new AppError('Not found company with that id', 404))
    }
    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const updateCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = await updateCompany(objId, req.body);
    if (!company) {
        return next(new AppError('Not found company with that id', 404))
    }
    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const deleteCompanyById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const objId = new Types.ObjectId(id);
    const company = deleteCompany(objId);

    res.status(200).json({
        status: 'success',
        data: company
    });
});

export const createCompany = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const company = await addCompany(req.body);
    res.status(201).json({
        status: 'success',
        data: company
    });
});