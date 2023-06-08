const express = require('express');
const { validateGetProduct, getProduct, validatesearchItem, searchItem, validateCheckout, checkout, validateOrder, order, validateViewOrder, viewOrder } = require('../controllers/productController');
const router = express.Router();

router.get('/:id', validateGetProduct, getProduct);
router.post('/search', validatesearchItem, searchItem);
router.post('/checkout', validateCheckout, checkout);
router.post('/order', validateOrder, order);
router.get('/view/:id', validateViewOrder, viewOrder);

module.exports = router;