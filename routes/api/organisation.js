const { fetchUserOrganisations, fetchAnOrganisation, createOrganisation, addUserToOrganisation } = require('../../controllers/organisation.controller');
const { authenticateUser } = require('../../middleware/auth');

const router = require('express').Router();

router.get('/', authenticateUser, fetchUserOrganisations);
router.get('/:orgId', authenticateUser, fetchAnOrganisation);
router.post('/', authenticateUser, createOrganisation);
router.post('/:orgId/users', authenticateUser, addUserToOrganisation);

module.exports = router;
