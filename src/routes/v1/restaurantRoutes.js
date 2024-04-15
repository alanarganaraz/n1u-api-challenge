const express = require('express');
const restaurantController = require('../../controllers/restaurantControllers');

const router = express.Router();

router
  .get('/', restaurantController.getAllRestaurants) // anda
  .get('/:restaurantId', restaurantController.getRestaurantById) // anda
  .delete('/:restaurantId', restaurantController.deleteRestaurantById) // anda
  .post('/', restaurantController.postRestaurant) // anda
  .patch('/:restaurantId', restaurantController.editRestaurantById); // anda

module.exports = router;
