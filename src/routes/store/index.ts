import express from 'express';

const router = express.Router()
const store = require('./controller')
const auth = require('./auth')

router.get('/', auth, store.getUser);
router.get('/detail', auth, store.getMyStore);
router.post('/detail', store.getStore);
router.get('/all', store.getStoreList);
router.post('/register', store.register);
router.post('/check-account-exist', store.checkAccountExist);

router.post('/update', auth, store.updateStore);

router.post('/login', store.login);
router.post('/logout', store.logout);

router.post('/check-verified', auth, store.checkVerified);

module.exports = router