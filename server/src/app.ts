import express, {Request, Response} from 'express';
import companyRouter from './routes/companyRoute';
import userRouter from './routes/userRoute';
import endpointRouter from './routes/endpointRoute';
import vacancyRouter from './routes/vacancyRoute';
import AppError from './utils/AppError';
import ErrorHandler from './controllers/errorHandler';
import cookieParser from 'cookie-parser';


export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        test: 'Hello world'
    });
});

// app.use('/', fileRoute);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/endpoints', endpointRouter);
app.use('/api/v1/vacancies', vacancyRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(ErrorHandler);
