import express, {Request, Response} from 'express';
import companyRouter from './routes/companyRoute';
import AppError from './utils/AppError';
import ErrorHandler from './controllers/errorHandler';


export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        test: 'Hello world'
    });
});

app.use('/api/v1/companies', companyRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(ErrorHandler);
