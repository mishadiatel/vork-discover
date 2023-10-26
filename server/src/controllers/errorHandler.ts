import {NextFunction, Request, Response} from 'express';
import AppError from '../utils/AppError';

const sendError = (err: AppError, req: Request, res: Response) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    sendError(err, req, res)
};

export default errorHandler;