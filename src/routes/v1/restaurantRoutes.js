const express = require('express');
const restaurantController = require('../../controllers/restaurantControllers');

const router = express.Router();

router
  .get('/', restaurantController.getAllRestaurants) 
  .get('/:restaurantId', restaurantController.getRestaurantById) 
  .delete('/:restaurantId', restaurantController.deleteRestaurantById) 
  .post('/', restaurantController.postRestaurant) 
  .patch('/:restaurantId', restaurantController.editRestaurantById); 

module.exports = router;
