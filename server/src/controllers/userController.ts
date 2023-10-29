import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import User from '../models/userModel';
import {Types} from 'mongoose';
import AppError from '../utils/AppError';
import {filterObj} from '../utils/filterObj';

export const getMe = catchError(async (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
});

export const getUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(new Types.ObjectId(req.params.id))
    if(!user) return next(new AppError('Not found user with that it', 404))
    res.status(200).json({
        status: 'success',
        data: user
    })
});

export const updateCurrentUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});