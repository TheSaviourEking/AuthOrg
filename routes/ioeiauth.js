/*

const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const { sequelize } = require('../models'); // Assuming Sequelize is used for models
const { generateToken } = require('../utils/token'); // Adjust as per your token generation function

// Helper function to clear database after each test
async function clearDatabase() {
    await sequelize.truncate({ cascade: true });
}

beforeEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await clearDatabase();
    await sequelize.close();
});

describe('Authentication Endpoints', () => {
    describe('POST /auth/register', () => {
        it('should register user successfully with default organisation', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            const res = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe('Registration successful');
            expect(res.body.data.user.firstName).toBe('John');
            expect(res.body.data.user.lastName).toBe('Doe');
            expect(res.body.data.user.email).toBe('john.doe@example.com');
            expect(res.body.data.user.phone).toBe('1234567890');
            expect(res.body.data.organisation.name).toBe("John's Organisation");
        });

        it('should fail if required fields are missing', async () => {
            const userData = {
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            const res = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(res.status).toBe(422);
            expect(res.body.errors).toHaveLength(1); 
            expect(res.body.errors[0]).toBe('Please provide first name');
        });

        it('should fail if there’s duplicate email or userID', async () => {
            const userData1 = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            const userData2 = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'john.doe@example.com',
                password: 'password456',
                phone: '9876543210'
            };

            // Register first user successfully
            await request(app)
                .post('/auth/register')
                .send(userData1);

            // Attempt to register second user with same email
            const res = await request(app)
                .post('/auth/register')
                .send(userData2);

            expect(res.status).toBe(422);
            expect(res.body.errors).toContain('Email already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should log the user in successfully', async () => {
            // Assuming you have a registered user in the database
            const registeredUser = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            // Register the user
            await request(app)
                .post('/auth/register')
                .send(registeredUser);

            // Login with valid credentials
            const loginRes = await request(app)
                .post('/auth/login')
                .send({
                    email: 'john.doe@example.com',
                    password: 'password123'
                });

            expect(loginRes.status).toBe(200);
            expect(loginRes.body.status).toBe('success');
            expect(loginRes.body.message).toBe('Login successful');
            expect(loginRes.body.data.user.firstName).toBe('John');
            expect(loginRes.body.data.user.lastName).toBe('Doe');
            expect(loginRes.body.data.user.email).toBe('john.doe@example.com');
            expect(loginRes.body.data.user.phone).toBe('1234567890');
        });

        it('should fail if invalid credentials are provided', async () => {
            const invalidCredentials = {
                email: 'invalid.email@example.com',
                password: 'invalidpassword'
            };

            const loginRes = await request(app)
                .post('/auth/login')
                .send(invalidCredentials);

            expect(loginRes.status).toBe(401);
            expect(loginRes.body.status).toBe('error');
            expect(loginRes.body.message).toBe('Invalid credentials');
        });
    });

    // Additional tests for token generation and organisation access can be added here
});

*/
