import express from 'express';

const router = express.Router()
const order = require('./controller')
const auth = require('../user/auth')
const authStore = require('../store/auth')

router.get('/detail/:id', auth, order.getOrder);
router.get('/store/detail/:id', authStore, order.getOrder);

router.get('/all', auth, order.getOrderList);
router.get('/store/all', authStore, order.getOrderList);

router.post('/add', auth, order.addOrder);
router.post('/update-status', auth, order.updateOrderStatus);
router.post('/store/update-status', authStore, order.updateOrderStatus);

module.exports = router