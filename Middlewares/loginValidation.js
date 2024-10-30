import { body} from 'express-validator';

// Login validation rules
export const loginValidator = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
];
