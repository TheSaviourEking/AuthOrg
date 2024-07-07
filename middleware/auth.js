const { verifyToken } = require('../utils/jwt');
const { User } = require('../db/models');

const authenticate = (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    const decoded = verifyToken(token);
    console.log(decoded)
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; // Attach decoded user info to request object
    next();
};

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedUser = verifyToken(token);
        req.user = await User.findByPk(decodedUser.id); // Attach user object to request
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};


module.exports = { authenticate, authenticateUser };
