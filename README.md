# AuthOrg

AuthOrg is a robust authentication and authorization system designed to manage users and their access to organization-specific data. This project features secure user registration, login, and token-based authentication, ensuring that only authorized users can access specific organizational data.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Get User Organizations](#get-user-organizations)
  - [Access Organization Data](#access-organization-data)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication and Authorization](#authentication-and-authorization)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration**: Register users with basic information and assign them to a default organization.
- **User Login**: Authenticate users and provide them with a secure token for accessing protected routes.
- **Token-Based Authentication**: Use JWT tokens to authenticate users and verify their access rights.
- **Organization Management**: Ensure users can only access data from organizations they belong to.
- **Error Handling**: Comprehensive error handling for different scenarios.

## Technologies Used

- **Node.js**: Backend server runtime
- **Express.js**: Web framework for Node.js
- **Sequelize**: ORM for managing the database
- **PostgreSQL**: Relational database
- **bcryptjs**: Library for hashing passwords
- **jsonwebtoken**: Library for generating and verifying JWT tokens
- **dotenv**: Module for loading environment variables
- **supertest**: Library for testing HTTP APIs

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database installed and running
- Basic understanding of JavaScript and Node.js

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/TheSaviourEking/AuthOrg.git
   cd AuthOrg
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```sh
   npx dotenv sequelize-cli db:migrate
   ```

5. Start the server:
   ```sh
   npm start
   ```

## Running Tests

To run the tests, use the following command:
```sh
npm test
```

## API Endpoints

### User Registration

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Registration successful",
    "data": {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890"
      },
      "organisation": {
        "id": 1,
        "name": "John's Organisation"
      },
      "accessToken": "your_jwt_token"
    }
  }
  ```

### User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890"
      },
      "accessToken": "your_jwt_token"
    }
  }
  ```

### Get User Organizations

- **URL**: `/api/organisations`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "organisations": [
        {
          "id": 1,
          "name": "John's Organisation"
        }
      ]
    }
  }
  ```

### Access Organization Data

- **URL**: `/api/organisations/:orgId`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "organisation": {
        "id": 1,
        "name": "John's Organisation"
      }
    }
  }
  ```

## Project Structure`
```
AuthOrg
├── app.js
├── bin
│   └── www
├── config
│   ├── database.js
│   └── index.js
├── controllers
│   ├── organisation.controller.js
│   ├── session.controller.js
│   └── user.controller.js
├── db
│   ├── migrations
│   │   ├── 20240706171133-create-user.js
│   │   ├── 20240706220154-create-organisation.js
│   │   └── 20240706224136-create-user-organisation.js
│   ├── models
│   │   ├── index.js
│   │   ├── organisation.js
│   │   ├── user.js
│   │   └── userorganisation.js
│   └── seeders
├── middleware
│   └── auth.js
├── package.json
├── package-lock.json
├── README.md
├── routes
│   ├── api
│   │   ├── index.js
│   │   ├── organisation.js
│   │   └── users.js
│   ├── auth
│   │   └── index.js
│   ├── index.js
│   └── ioeiauth.js
├── tests
│   └── auth.spec.js
└── utils
    ├── jwt.js
    └── validation.js
```

## Database Schema

### User Table

| Column     | Type    | Description           |
|------------|---------|-----------------------|
| id         | Integer | Primary key           |
| firstName  | String  | User's first name     |
| lastName   | String  | User's last name      |
| email      | String  | User's email (unique) |
| password   | String  | User's password       |
| phone      | String  | User's phone number   |

### Organisation Table

| Column     | Type    | Description               |
|------------|---------|---------------------------|
| id         | Integer | Primary key               |
| name       | String  | Organisation's name       |
| userId     | Integer | Foreign key to User table |

## Authentication and Authorization

- **JWT Tokens**: AuthOrg uses JWT tokens to manage user sessions. The tokens are signed using a secret key and include user information.
- **Token Verification**: Every request to a protected route is authenticated by verifying the JWT token sent in the request headers.
- **Access Control**: Users can only access data from organizations they are part of. Unauthorized access is restricted and results in a `403 Forbidden` response.

## Error Handling

AuthOrg includes comprehensive error handling for various scenarios:

- **User Registration Errors**: Validation errors, duplicate email, missing fields
- **User Login Errors**: Invalid credentials, missing fields
- **Authorization Errors**: Invalid or expired tokens, unauthorized access

## Environment Variables

AuthOrg uses environment variables to manage configuration settings. The following variables are required:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
