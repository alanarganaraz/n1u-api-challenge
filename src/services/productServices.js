const Product = require('../databases/product');

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    Product.getAllProducts()
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postNewProducts = payload => {
  return new Promise((resolve, reject) => {
    Product.postNewProducts(payload)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const editProductById = payload => {
  return new Promise((resolve, reject) => {
    Product.editProductById(payload)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const deleteProductById = productId => {
  return new Promise((resolve, reject) => {
    Product.deleteProductById(productId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postNewPromotion = payload => {
  return new Promise((resolve, reject) => {
    Product.postNewPromotion(payload)
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
    Product.getPromotionById(promotionId)
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
    Product.deletePromotionById(promotionId)
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
    Product.editPromotionById(payload)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  getAllProducts,
  postNewProducts,
  editProductById,
  deleteProductById,
  postNewPromotion,
  getPromotionById,
  deletePromotionById,
  editPromotionById,
};
