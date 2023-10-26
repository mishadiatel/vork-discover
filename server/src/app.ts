import express, {Request, Response} from 'express';


export const app = express();

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        test: 'Hello world'
    });
});
