const express = require('express');
const promotionController = require('../../controllers/promotionControllers');

const router = express.Router();

router
  .post('/', promotionController.postNewPromotion) // anda
  .get('/:promotionId', promotionController.getPromotionById) // anda
  .delete('/:promotionId', promotionController.deletePromotionById) 
  .patch('/:promotionId', promotionController.editPromotionById); // anda

module.exports = router;
