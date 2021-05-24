const { LOGIN, REGISTER } = require('../controllers/Auth');
const router = require('express').Router();

router.post('/login', LOGIN)
router.post('/register', REGISTER)

module.exports = router;