import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../../../../config/config';

const router: Router = Router();

// Generate hashed passwords
async function generatePassword(plainTextPassword: string) {
    const saltRounds = 11;
    await bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
        return (hash ? hash : err);
    });
}

// check a password
async function checkPasswords(plainTextPassword: string, hash: string) {
    await bcrypt.compare(plainTextPassword, hash, function(err, result) {
        return (hash ? hash : err);
    });
}

// generate JWT
function generateJWT(user: User): string {
    return jwt.sign(user, config.dev.jwt_secret);
}

// authentication function
export function requireAuth (req: Request, res: Response, next: NextFunction) {
    // check for authorization header
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({
            message: 'No authorization headers'
        });
    }

    // extract and check token bearer
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({
            message: 'Malformed token'
        });
    }
    const token = token_bearer[1];
    return jwt.verify(token, config.dev.jwt_secret, function (err, decoded) {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate'
            });
        }
        return next();
    });
}

// login existing user
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if email
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({
            auth: false,
            message: 'Email is required or malformed'
        });
    }

    // check if password
    if (!password) {
        return res.status(400).send({
            auth: false,
            message: 'Password is required'
        });
    }

    // check that user exists
    const user: any = await User.findOne({ where: { email: email }});
    if (!user) {
        return res.status(401).send({
            auth: false,
            message: 'Unauthorized'
        });
    }

    // check that password matches
    const authValid: any = await checkPasswords(password, user.password_hash);
    if (!authValid) {
        return res.status(401).send({
            auth: false,
            message: 'Unauthorized'
        });
    }

    // generate JWT and approve
    const jwt = generateJWT(user)
    return res.status(200).send({
        auth: true,
        token: jwt,
        user: user.email
    });
});

// register a new user
router.post('/', async (req: Request, res: Response) => {
    const { email, plainTextPassword } = req.body;

    // check if email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({
            auth: false,
            message: 'Email is required or malformed'
        });
    }

    // check if password is valid
    if (!plainTextPassword) {
        return res.status(400).send({
            auth: false,
            message: 'Password is required'
        });
    }

    // find the user
    const user = await User.findOne({ where: { email: email }});
    // check if user exists
    if (user) {
        return res.status(422).send({
            auth: false,
            message: 'User may already exist'
        });
    }

    // get hashed password
    const password_hash = await generatePassword(plainTextPassword);

    // create new user
    const newUser = await new User({
        email: email,
        password_hash: password_hash
    });

    // store user in database
    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (e) {
        throw e;
    }

    return res.status(201).send({
        user: savedUser
    });
});

export const AuthRouter: Router = router;