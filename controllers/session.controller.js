const { User } = require('../db/models');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../utils/jwt');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate the password
    const isValidPassword = bcrypt.compareSync(password, user.password);
  
    // If the password is invalid, return an error
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = setTokenCookie(res, user);

    // Return the token to the client
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    // Handle any errors
    // TODO
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

module.exports = { login };
