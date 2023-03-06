import express from 'express';

const router = express.Router()
const store = require('./controller')
const auth = require('./auth')

// for store
router.get('/', auth, store.getUser);
router.post('/register', store.register);
router.post('/check-account-exist', store.checkAccountExist);
router.post('/login', store.login);
router.post('/logout', store.logout);

router.get('/mystore', auth, store.getMyStore);     // get detail of my store
router.post('/update', auth, store.updateStore);

// for customer
router.get('/detail/:id', store.getStore);
router.get('/all', store.getStoreList);             // ?keyword=xxx


module.exports = router