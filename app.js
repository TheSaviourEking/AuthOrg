const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const { ValidationError } = require('sequelize');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

const routes = require('./routes');
app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.status = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.statusCode = 404;
    next(err);
});

app.use((err, _req, res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map(e => {
            return { field: e.path, message: e.message }
        });
        err.statusCode = 422;

        return res.status(422).json({
            errors: err.errors,
            stack: isProduction ? null : err.stack
        });
    }
    next(err)
});

app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500);
    // console.error(err);
    res.json({
        // title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;
