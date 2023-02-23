import express from 'express';

const router = express.Router()
const cart = require('./controller')
const auth = require('../user/auth')

router.get('/', auth, cart.getCartItemList);

router.post('/add', auth, cart.addCartItem);
router.post('/update', auth, cart.updateCartItem);
router.post('/delete', auth, cart.deleteCartItem);

router.post('/check-store', auth, cart.checkItemSameStore);

module.exports = router