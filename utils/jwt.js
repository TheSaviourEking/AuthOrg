const jwt = require('jsonwebtoken');
const { jwtConfig: { secret, expiresIn } } = require('../config');

const setTokenCookie = (res, user) => {
    // Create a token.
    const token = jwt.sign(
        { id: user.userId, email: user.email },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

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

module.exports = { setTokenCookie, verifyToken };
