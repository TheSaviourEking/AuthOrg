const { Organisation, User, UserOrganisation } = require('../db/models');

const fetchUserOrganisations = async (req, res, next) => {
    const userId = req.user.dataValues.userId;
    try {
        // Fetch the user with associated organisations
        const user = await User.findByPk(userId, {
            include: {
                model: Organisation,
                through: { attributes: [] },
                attributes: ['orgId', 'name', 'description'] // Specify attributes to include from Organisation model
            }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Extract relevant data from user object
        const { Organisations } = user;

        const responseData = {
            // organisations: Organisations[0];
            organisations: Organisations
        };

        // Send response
        res.status(200).json({
            status: 'success',
            message: 'User organisations fetched successfully',
            data: responseData
        });
    } catch (error) {
        next(error); // Pass errors to error handling middleware
    }
};

const fetchAnOrganisation = async (req, res, next) => {
    console.log(req.params)
    const { orgId } = req.params;
    const userId = req.user.userId;

    try {
        const userOrganisation = await UserOrganisation.findOne({
            where: { userId, organisationId: orgId }
        });
        if (!userOrganisation) {
            const error = new Error('User not found');
            error.message = 'Forbidden: Access to the organisation is denied'
            error.statusCode = 404;
            next(error);
        }
        const organisation = await Organisation.findByPk(orgId);
        if (!organisation) {
            const error = new Error('Organisation not found');
            error.statusCode = 404;
            throw error;
        }

        const { name, description } = organisation;


        res
            .status(200)
            .json({
                status: "success",
                message: `Succeessfully fetched organisation with id ${orgId}`,
                data: {
                    orgId, // Unique
                    name, // Required and cannot be null
                    description,
                }
            });
    } catch (error) {
        next(error)
    }
}

const createOrganisation = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const organisation = await Organisation.create({ name, description });
        if (!organisation) {
            const error = new Error();
            error.statusCode = 400;
            error.status = 'Bad Request';
            error.message = 'Client error';

            throw error;
        }

        return res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
                orgId: organisation.orgId,
                name,
                description
            }
        })
    } catch (error) {
        next(error);
    }
}

const addUserToOrganisation = async (req, res, next) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    try {
        // Find the organization
        const organisation = await Organisation.findByPk(orgId, {
            include: [{
                model: User,
                through: { attributes: [] } // This excludes the join table attributes
            }]
        });

        // If organization is not found, return an error
        if (!organisation) {
            return res.status(404).json({
                status: 'error',
                message: 'Organisation not found'
            });
        }

        // Find the user
        const user = await User.findByPk(userId);

        // If user is not found, return an error
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Add the user to the organization
        await UserOrganisation.findOrCreate({
            where: {
                userId: user.userId,
                organisationId: organisation.orgId
            }
        });

        // Return a success response
        return res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
        });
    } catch (err) {
        // Pass the error to the next middleware for handling
        next(err);
    }
}


module.exports = { fetchUserOrganisations, fetchAnOrganisation, createOrganisation, addUserToOrganisation };
