const express = require('express');
const productController = require('../../controllers/productControllers');

const router = express.Router();

router
  .get('/', productController.getAllProducts)
  .post('/', productController.postNewProducts)
  .patch('/:productId', productController.editProductById)
  .delete('/:productId', productController.deleteProductById)

module.exports = router;
