const express = require('express');

const { fetchAUser } = require('../../controllers/user.controller');
const {authenticateUser} = require('../../middleware/auth');

const router = express.Router();

router.get('/:id', authenticateUser, fetchAUser);

module.exports = router;
