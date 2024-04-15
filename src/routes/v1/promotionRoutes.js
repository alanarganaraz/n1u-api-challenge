const express = require('express');
const promotionController = require('../../controllers/promotionControllers');

const router = express.Router();

router
  .post('/', promotionController.postNewPromotion)
  .get('/:promotionId', promotionController.getPromotionById)
  .delete('/:promotionId', promotionController.deletePromotionById)
  .patch('/:promotionId', promotionController.editPromotionById);

module.exports = router;
