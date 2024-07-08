const { verifyToken } = require('../utils/jwt');
const { User } = require('../db/models');

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedUser = verifyToken(token);
        if (decodedUser) {
            req.user = await User.findByPk(decodedUser.userId); // Attach user object to request
            next();
        }
        else {
            const err = new Error('invalid user')
            next(err)
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};


module.exports = { authenticateUser };
