export const config = {
    "dev": {
      "username": process.env.DESIREWORKS_DEV_POSTGRES_USERNAME,
      "password": process.env.DESIREWORKS_DEV_POSTGRES_PASSWORD,
      "database": process.env.DESIREWORKS_DEV_POSTGRES_DATABASE,
      "host": process.env.DESIREWORKS_DEV_POSTGRES_HOST,
      "dialect": "postgres",
      "aws_region": process.env.DESIREWORKS_DEV_AWS_REGION,
      "aws_profile": process.env.DESIREWORKS_DEV_AWS_PROFILE,
      "aws_images_bucket": process.env.DESIREWORKS_DEV_AWS_MEDIA_BUCKET,
      "jwt_secret": process.env.DESIREWORKS_DEV_JWT_SECRET
    },
    "prod": {
      "username": "",
      "password": "",
      "database": "",
      "host": "",
      "dialect": "postgres"
    }
  }