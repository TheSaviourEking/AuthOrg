const { login } = require('../../controllers/session.controller');
const { signup } = require('../../controllers/user.controller');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = require('express').Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide last name'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required to signup'),
    // check('phone')
        // .exists({ checkFalsy: true })
        // .withMessage('Phone number is required.')
        // .isMobilePhone()
        // .withMessage('Invalid phone number format.'),

    handleValidationErrors
];

const validateLogin = [
    check('email')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isEmail()
        .withMessage('Please provide a valid email.'),

    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password'),

    handleValidationErrors
];


router.post('/register', validateSignup, signup);
router.post('/login', validateLogin, login)

module.exports = router;
