import express from 'express';

const router = express.Router()
const reduction = require('./controller')
const auth = require('../auth')
const authUser = require('../user/auth')
const authStore = require('../store/auth')

router.get('/', reduction.getReduction);
router.post('/all', reduction.getReductionList);

router.post('/add', authStore, reduction.addReduction);
router.post('/update', authStore, reduction.updateReduction);

router.post('/delete', authStore, reduction.deleteReduction);

module.exports = router