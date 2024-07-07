const router = require('express').Router();

const usersRouter = require('./users.js');

// router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/organisations', require('./organisation.js'));

module.exports = router;
