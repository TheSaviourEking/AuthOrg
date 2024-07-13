const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Api is currently running, read the github readme for sample usage instructions'
    })
})
router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

// Add a XSRF-TOKEN cookie in development
// if (process.env.NODE_ENV !== 'production') {
//     router.get('/api/csrf/restore', (req, res) => {
//         res.cookie('XSRF-TOKEN', req.csrfToken());
//         return res.json({});
//     });
// }

module.exports = router;
