import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import Endpoint from '../models/endpointsModel';
import AppError from '../utils/AppError';
import {Types} from 'mongoose';

export const getAllEndpoints = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const endpoints = await Endpoint.find();
    if (!endpoints) {
        return next(new AppError('Not found endpoints', 404));
    }

    res.status(200).json({
        status: 'success',
        data: endpoints
    });
});

export const getOneEndpoint = catchError(async (req: Request, res: Response, next: NextFunction) => {

    const id = new Types.ObjectId(req.params.id);
    const endpoint = await Endpoint.findById(id);
    if (!endpoint) {
        return next(new AppError('Not fount endpoint', 404));
    }

    res.status(200).json({
        status: 'success',
        data: endpoint
    });
});
