const bcrypt = require('bcryptjs');
const { User, Organisation, UserOrganisation } = require('../db/models');
const { Op } = require('sequelize');
const { setTokenCookie } = require('../utils/jwt');

const signup = async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create the user
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, phone });

        // Create the organisation
        const organisationName = `${firstName}'s Organisation`;
        const organisation = await Organisation.create({ name: organisationName });

        // Add user to organisation
        await UserOrganisation.create({ userId: user.userId, organisationId: organisation.orgId });

        // Generate JWT token
        const token = setTokenCookie(res, user);

        // Return the user and token
        return res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hashedPassword
                }
            }
        })

    } catch (error) {
        // console.error('Signup error:', error);
        const err = new Error('Bad request');
        err.status = 'Bad request';
        err.message = 'Registration unsuccessful';
        err.statusCode = 422; //400;
        next(err);
        // return res.status(500).json({ error: 'An error occurred while signing up' });
    }
};

const fetchAUser = async (req, res, next) => {
    const { id } = req.params;
    // search for user;
    // if found return else push to next error handler;
    try {
        const user = await User.findOne({
            where: {
                userId: {
                    [Op.eq]: id
                }
            }
        });

        if (!user) {
            throw new Error('Bad request');
        };

        return res.json({
            status: 'success',
            message: 'successfully fetched user ' + user.userId,
            data: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        })
    } catch (error) {
        next(error);
    }

}

module.exports = { signup, fetchAUser };
