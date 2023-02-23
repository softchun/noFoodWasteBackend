import express from 'express';

const router = express.Router()
const order = require('./controller')
const auth = require('../user/auth')
const authStore = require('../store/auth')

router.post('/detail', auth, order.getOrder);
router.post('/store/detail', authStore, order.getOrder);

router.post('/', auth, order.getOrderList);
router.post('/store', authStore, order.getOrderList);

router.post('/add', auth, order.addOrder);
router.post('/update-status', auth, order.updateOrderStatus);
router.post('/store/update-status', authStore, order.updateOrderStatus);

module.exports = router