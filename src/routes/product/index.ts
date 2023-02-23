import express from 'express';

const router = express.Router()
const product = require('./controller')
const auth = require('../store/auth');

router.get('/', auth, product.getProduct);
router.get('/all', auth, product.getProductList);

router.post('/add', auth, product.addProduct);
router.post('/update', auth, product.updateProduct);

router.post('/delete', auth, product.deleteProduct);

module.exports = router