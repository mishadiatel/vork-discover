import catchError from '../utils/catchError';
import {NextFunction, Request, Response} from 'express';
import User from '../models/userModel';
import {Types} from 'mongoose';
import AppError from '../utils/AppError';
import {filterObj} from '../utils/filterObj';
import multer from 'multer';
import sharp from 'sharp';


// const multerStorage = multer.memoryStorage();
//
// const imageFileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
//     if (file.mimetype.startsWith('image')) {
//         console.log('image');
//         cb(null, true);
//     } else {
//         console.log('not image');
//         cb(new AppError('Not an image. Please upload only images.', 400), false);
//     }
//
// };
//
// const upload = multer({
//     storage: multerStorage,
//     fileFilter: imageFileFilter
// });
//
// export const uploadUserPhoto = upload.single('photo');

// export const resizeUserPhoto = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.file) return next();
//     console.log(req.file);
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//     await sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`uploads/${req.file.filename}`);
//     next();
// });
export const getMe = catchError(async (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
});

export const getUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(new Types.ObjectId(req.params.id)).populate({
        path: 'recruiterVacancies',
        select: '-recruiter -__v'
    })
    if (!user) return next(new AppError('Not found user with that it', 404));
    res.status(200).json({
        status: 'success',
        data: user
    });
});

export const updateCurrentUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');
    // if (req.file) filteredBody.photo = req.file?.filename;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});