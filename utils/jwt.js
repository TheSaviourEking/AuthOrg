require('dotenv').config();
const jwt = require('jsonwebtoken');
const { jwtConfig: { secret, expiresIn } } = require('../config');

const signToken = (user) => {
    const { userId, firstName, lastName, email, password, phone } = user;
    return jwt.sign(
        { userId, email, firstName, lastName, password, phone },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );
}
const setTokenCookie = (res, user) => {
    const token = signToken(user);

    const isProduction = process.env.NODE_ENV === 'production';

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    });

    return token;
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

module.exports = { setTokenCookie, verifyToken, signToken };
