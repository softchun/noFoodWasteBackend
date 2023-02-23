import express from 'express';

const router = express.Router()
const user = require('./controller')
const auth = require('../auth')
const authUser = require('./auth')

router.get('/', authUser, user.getUser);
router.post('/register', user.register);
router.post('/check-account-exist', user.checkAccountExist);

router.post('/login', user.login);
router.post('/logout', user.logout);

router.get('/check-verified', auth, user.checkVerified);

module.exports = router