const Promotion = require('../databases/promotion');

const postNewPromotion = payload => {
  return new Promise((resolve, reject) => {
    Promotion.postNewPromotion(payload)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getPromotionById = promotionId => {
  return new Promise((resolve, reject) => {
    Promotion.getPromotionById(promotionId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const deletePromotionById = promotionId => {
  return new Promise((resolve, reject) => {
    Promotion.deletePromotionById(promotionId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const editPromotionById = (payload) => {
  return new Promise((resolve, reject) => {
    Promotion.editPromotionById(payload)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  postNewPromotion,
  getPromotionById,
  deletePromotionById,
  editPromotionById,
};
