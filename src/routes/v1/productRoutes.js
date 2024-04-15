const express = require('express');
const productController = require('../../controllers/productControllers');

const router = express.Router();

router
  .get('/', productController.getAllProducts) // anda
  .get('/restaurant/:restaurantId', productController.getAllRestaurantProducts) //anda
  .get('/:productId', productController.getProductById) // anda
  .post('/', productController.postNewProducts) // anda
  .patch('/:productId', productController.editProductById) // anda
  .delete('/:productId', productController.deleteProductById) // anda

module.exports = router;
