import express, {Request, Response} from 'express';
import companyRouter from './routes/companyRoute';
import userRouter from './routes/userRoute';
import endpointRouter from './routes/endpointRoute';
import vacancyRouter from './routes/vacancyRoute';
import AppError from './utils/AppError';
import ErrorHandler from './controllers/errorHandler';
import cookieParser from 'cookie-parser';
import helmet, {xssFilter} from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize'
// @ts-ignore
import xss from 'xss-clean'


export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('uploads'));

app.use(helmet())

const limiter = rateLimit({
    max: 200,
    windowMs: 60*60*1000,
    message: 'Too many requests to this api. Please try again in one hour!'
})

app.use('/api', limiter)

app.use(mongoSanitize())
app.use(xss())

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
