import {Router, Request, Response} from 'express';
import path from 'path';

const router = Router();

router.get('/resume/:filename', (req: Request, res: Response) => {
    const fileName = req.params.filename;
    const filePath = path.join('uploads', fileName);
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    })
})

export default router;