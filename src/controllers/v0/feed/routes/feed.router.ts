import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import {getGetSignedUrl, getPutSignedUrl } from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await FeedItem.findAndCountAll({
            order: [['id', 'DESC']]
        });
        items.rows.map((row: any) => {
            if (row.url) {
                row.url = getGetSignedUrl(row.url);
            }
        });
        return res.status(200).send(items);
    } catch (e) {
        return res.status(503)
            .send(`Cannot connect to database. Error: ${e}`);
    }
});

// GET a specific resource by Primary Key
router.get('/:id',
    async(req: Request, res: Response) => {
        // Parse and check for an integer id parameter
        const { id } = req.params;
        const parsed_id = parseInt(id, 10);
        if (!id || !Number.isInteger(parsed_id)) {
            return res.status(400)
                .send('id number parameter is required');
        }

        // Get the item
        try {
            const item = await FeedItem.findByPk(parsed_id);

            // Check the result
            if (item === null) {
                return res.status(404)
                    .send(`Item with id "${parsed_id}" not found`);
            } else {
                return res.status(200).send(item);
            }
        } catch (e) {
            return res.status(503)
                .send(`Cannot connect to database. Error: ${e}`);
        }
    }
);

// Update a specific resource
router.patch('/:id',
    async (req: Request, res: Response) => {
        // Parse and check for an integer id parameter
        const { id } = req.params;
        const parsed_id = parseInt(id, 10);
        if (!id || !Number.isInteger(parsed_id)) {
            return res.status(400)
                .send('id number parameter is required');
        }

        // Check body
        const { caption, url } = req.body;
        if (!caption && !url) {
            return res.status(400).send({
                message: 'caption or url is required'
            });
        }

        // Update caption and url
        let updated: any = undefined;
        if (caption) {
            try {
                updated = await FeedItem.update({
                    caption: caption
                }, {
                    where: {
                        id: parsed_id
                    }
                });
            } catch (e) {
                return res.status(503)
                    .send(`Cannot connect to database. Error: ${e}`);
            }
        }

        if (url) {
            try {
                updated = await FeedItem.update({
                    url: url
                }, {
                    where: {
                        id: parsed_id
                    }
                });
            } catch (e) {
                return res.status(503)
                    .send(`Cannot connect to database. Error: ${e}`);
            }
        }        

        // Return end result of update
        if (updated == 1) {
            try {
                // Get the updated item
                const item = await FeedItem.findByPk(parsed_id);
                // Check the result
                if (item === null) {
                    return res.status(404)
                        .send(`Item with id "${parsed_id}" not found`);
                } else {
                    return res.status(200).send(item);
                }
            } catch (e) {
                return res.status(503)
                    .send(`Cannot connect to database. Error: ${e}`);
            }
        } else {
            return res.status(400).send('Update failed');
        }
    }


);

// Get a signed url to put a new item in the S3 bucket
router.get('/signed-url/:fileName',
    async (req: Request, res: Response) => {
        const { fileName } = req.params;
        const url = getPutSignedUrl(fileName);
        res.status(201).send({url: url});
    }
);

// Post a feed item
router.post('/',
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const url = req.body.url;

        // Check caption is valid
        if (!caption) {
            return res.status(400).send({
                message: 'Caption is required or malformed'
            });
        }

        // Check url is valid
        if (!url) {
            return res.status(400).send({
                message: 'url is required'
            });
        }

        try {
            // Create new FeedItem
            const item = await new FeedItem({
                caption: caption,
                url: url
            });

            // Save item to database
            const saved_item: any = await item.save();

            // Request a signed url for the image
            saved_item.url = await getGetSignedUrl(saved_item.url);

            return res.status(201).send(saved_item);
        } catch (e) {
            return res.status(503)
                .send(`Cannot connect to database. Error: ${e}`);
        }
    }
);

export const FeedRouter: Router = router;