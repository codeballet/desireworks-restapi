const AWS = require('aws-sdk');
import { config } from './config/config';

// Get configuration details
const c = config.dev;

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
AWS.config.credentials = credentials;

// Construct S3 service object
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: c.aws_region,
    params: {Bucket: c.aws_images_bucket}
});

/* getGetSignedURL generates an AWS signed url to get an item
 * @Params:
 *      key: string - the filename to be put into the S3 bucket
 * @Returns:
 *      a url as a string
 */
export function getGetSignedUrl (key: string): string {
    const signedUrlExpireSeconds = 60 * 5;

    const url = s3.getSignedUrl('getObject', {
        Bucket: c.aws_images_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
    });

    return url;
}

/* getPutSingedUrl generates an AWS signed url to put an item
 * @Params:
 *      key: string - the filename to be retreived from S3 bucket
 * @ Returns:
 *      a url as a string
 */
export function getPutSignedUrl (key: string): string {
    const signedUrlExpireSeconds = 60 * 5;

    const url = s3.getSignedUrl('putObject', {
        Bucket: c.aws_images_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
    });

    return url;
}