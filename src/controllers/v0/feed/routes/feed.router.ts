import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    return res.status(200).send('All is working well!');
});

export const FeedRouter: Router = router;