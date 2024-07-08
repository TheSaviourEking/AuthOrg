require('dotenv').config();

process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require("supertest");
const { User } = require('../db/models');
const { sequelize } = require('../db/models');
const bcrypt = require('bcryptjs');
const { verifyToken, signToken } = require('../utils/jwt');

// clear database

// token generation test

const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '1234567890'
};

const user1 = {
    firstName: 'user1',
    lastName: 'Doe1',
    email: 'john.doe@exafmple.com',
    password: 'password123',
    phone: '1234567890'
};
const user2 = {
    firstName: 'user2',
    lastName: 'Doe2',
    email: 'user2.doe@exafmple.com',
    password: 'password123',
    phone: '1234567890'
};

describe("Integration Testing - API with Real Database", () => {
    // Set up your testing environment
    beforeAll(async () => {
        // Initialize a testing database or environment
        await sequelize.sync({ force: true });
    }, 30000); // 30 seconds timeout
    describe('Token generation', () => {
        it('should ensure token expires at the correct time and correct user details is found in token', async () => {

            const res = await request(app)
                .post('/auth/register')
                .send(user);
            // console.log(res.body)
            const accessToken = res.body.data.accessToken;
            console.log(accessToken)
            // expect(statusCode).toEqual(201);
            // expect(status).toEqual('success');
            // expect(message).toEqual("Registration successful");
            // expect(firstName).toEqual(user.firstName);
            // expect(lastName).toEqual(user.lastName);
            // expect(email).toEqual(user.email);
            // expect(phone).toEqual(user.phone);
            // expect(bcrypt.compareSync(user.password, password)).toBe(true);
            /*
            {
    }
      */
            const userFromToken = verifyToken(accessToken);
            expect(userFromToken.email).toEqual(user.email);
            expect(userFromToken.firstName).toEqual(user.firstName);
            expect(userFromToken.lastName).toEqual(user.lastName);
            expect(userFromToken.phone).toEqual(user.phone);
            expect(bcrypt.compareSync(user.password, userFromToken.password)).toBe(true);

            setTimeout(() => {
                expect(verifyToken(accessToken)).toBe(null);
            }, 3000)
        })
    });

    describe('Organisation', () => {
        it('should ensure users can\'t see data from organisations they don\'t have access to', async () => {
            const createdUser1 = await request(app)
                .post('/auth/register')
                .send(user1);
            const createdUser2 = await request(app)
                .post('/auth/register')
                .send(user2);
            const accessToken1 = createdUser1.body.data.accessToken;
            const accessToken2 = createdUser2.body.data.accessToken;
            const createdUser1Organisations = await request(app)
                .get('/api/organisations')
                .set('Cookie', `token=${accessToken1}`);

            const userOneOrgId = createdUser1Organisations.body.data.organisations[0].orgId;

            const userTwoAccessUserOneOrganisations = await request(app)
                .get(`/api/organisations/${userOneOrgId}`)
                .set('Cookie', `token=${accessToken2}`);
            expect(userTwoAccessUserOneOrganisations.body.message).toEqual('Forbidden: Access to the organisation is denied')
        })
    })
});

describe("End To End Testing - API with Real Database", () => {
    beforeAll(async () => {
        // Initialize a testing database or environment
        await sequelize.sync({ force: true });
    }, 30000); // 30 seconds timeout
    describe('Register User Successfully with Default Organisation', () => {
        it('should a user is registered successfully when no organisation details are provided', async () => {
            const registeredUser = await request(app)
                .post('/auth/register')
                .send(user);
            expect(registeredUser.body.status).toBe('success');
            expect(registeredUser.body.message).toBe('Registration successful');
            expect(registeredUser.body.data.user.firstName).toBe(user.firstName);
            expect(registeredUser.body.data.user.lastName).toBe(user.lastName);
            expect(registeredUser.body.data.user.email).toBe(user.email);
        })
    })

    describe('Verify the default organisation name is correctly generated', () => {
        it('Verify the default organisation name is correctly generated (e.g., "John\'s Organisation" for a user with the first name "John")', async () => {
            const registeredUser = await request(app)
                .post('/auth/register')
                .send(user1);
            const regUserToken = registeredUser.body.data.accessToken;
            const userOrg = await request(app)
                .get('/api/organisations')
                .set('Cookie', `token=${regUserToken}`);
            expect(userOrg.body.data.organisations[0].name).toEqual(`${user1.firstName}'s Organisation`)//"John's Organisation"
        })
    })

    describe('Check that the response contains the expected user details and access token.', () => {
        it('should Check that the response contains the expected user details and access token.', async () => {
            const user = {
                firstName: 'Saviour',
                lastName: 'Eking',
                email: 'saviour.eking@example.com',
                password: 'password123',
                phone: '1234567890'
            };
            const registeredUser = await request(app)
                .post('/auth/register')
                .send(user);

            const token = signToken(user);
            const regUserToken = registeredUser.body.data.accessToken;

            const verifiedToken = verifyToken(token);
            const verifiedRegUserToken = verifyToken(regUserToken);

            expect(registeredUser).not.toBeNull();
            expect(verifiedToken.firstName).toEqual(verifiedRegUserToken.firstName);
            expect(verifiedToken.email).toEqual(verifiedRegUserToken.email);
            expect(verifiedToken.lastName).toEqual(verifiedRegUserToken.lastName);
        })
    })

    describe('Log the user in successfully', () => {
        let validLogin, invalidLogin;
        const validUser = {
            email: 'john.doe@example.com',
            password: 'password123'
        }

        const inValidUser = {
            email: 'john.doe@examdple.com',
            password: 'password123'
        }

        beforeEach(async () => {
            validLogin = await request(app)
                .post('/auth/login')
                .send(validUser);
            invalidLogin = await request(app)
                .post('/auth/login')
                .send(inValidUser);
        })
        it('It Should Log the user in successfully:Ensure a user is logged in successfully when a valid credential is provided and fails otherwise.', async () => {
            expect(validLogin.body).toBeInstanceOf(Object);
            expect(validLogin.body.status).toBe('success');
        })

        it('should fail on invalid credentials', () => {
            expect(invalidLogin.body).toHaveProperty('error');
            expect(invalidLogin.body.error).toEqual('Invalid email or password');
        })

        it('should check that the response contains the expected user details and access token.', () => {
            expect(validLogin.body.message).toBe('Login successful');
            expect(validLogin.body.data.user.firstName).toEqual('John');
            expect(validLogin.body.data.user.lastName).toEqual('Doe');
            const accessToken = validLogin.body.data.accessToken;
            const verifiedToken = verifyToken(accessToken);
            expect(verifiedToken.email).toEqual(validUser.email);
            expect(bcrypt.compareSync(validUser.password, verifiedToken.password)).toBe(true)
        })
    })

    describe('It Should Fail If Required Fields Are Missing Test cases for each required field (firstName, lastName, email, password) missing.', () => {
        let invalidSignupNoFirstName, invalidSignupNoLastName, invalidSignupNoEmail, invalidSignupNoPassword;

        beforeEach(async () => {
            invalidSignupNoFirstName = {
                firstName: '',
                lastName: 'Tim',
                email: 'john@tim.com',
                password: '123456123'
            }
            invalidSignupNoLastName = {
                firstName: 'John',
                lastName: '',
                email: 'john@tim.com',
                password: '123456123'
            };
            invalidSignupNoEmail = {
                firstName: 'John',
                lastName: 'Tim',
                email: '',
                password: '123456123'
            };
            invalidSignupNoPassword = {
                firstName: '',
                lastName: 'Tim',
                email: 'john@tim.com',
                password: ''
            }
        })
        it('Fail if FirstName is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidSignupNoFirstName)

            expect(res.status).toEqual(422);
            const error = res.body.errors.find((error) => error.field === 'firstName');
            expect(error).toHaveProperty('message', 'Registration unsuccessful');
            // expect(res.body)
        })
        it('Fail if LastName is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidSignupNoLastName)

            expect(res.status).toEqual(422);
            const error = res.body.errors.find((error) => error.field === 'lastName');
            expect(error).toHaveProperty('message', 'Registration unsuccessful');
            // expect(res.body)
        })
        it('Fail if email is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidSignupNoEmail)

            expect(res.status).toEqual(422);
            const error = res.body.errors.find((error) => error.field === 'email');
            expect(error).toHaveProperty('message', 'Registration unsuccessful');
            // expect(res.body)
        })
        it('Fail if password is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidSignupNoPassword);

            expect(res.status).toEqual(422);
            const error = res.body.errors.find((error) => error.field === 'password');
            expect(error).toHaveProperty('message', 'Registration unsuccessful');
        })
    })

    describe('It Should Fail if there\'s Duplicate Email or UserID:Attempt to register two users with the same email.', () => {
        let duplicateUser1;
        beforeEach(async () => {
            duplicateUser1 = {
                firstName: 'user1',
                lastName: 'Doe1',
                email: 'john.doe@exafmple.com',
                password: 'password123',
                phone: '1234567890'
            };
        })

        it('It Should Fail if there\'s Duplicate Email or UserID:Attempt to register two users with the same email.', async () => {
            const registeredUser = await request(app)
                .post('/auth/register')
                .send(duplicateUser1);

            expect(registeredUser.status).toEqual(422);
            expect(registeredUser.body.message).toEqual('Registration unsuccessful');
        })
    })
});
