const express = require('express');
const productController = require('../../controllers/productControllers');

const router = express.Router();

router
  .get('/', productController.getAllProducts)
  .get('/restaurant/:restaurantId', productController.getAllRestaurantProducts)
  .get('/:productId', productController.getProductById)
  .post('/', productController.postNewProducts)
  .patch('/:productId', productController.editProductById) 
  .delete('/:productId', productController.deleteProductById)

module.exports = router;
