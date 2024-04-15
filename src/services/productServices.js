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

const getAllRestaurantProducts = restaurantId => {
  return new Promise((resolve, reject) => {
    Product.getAllRestaurantProducts(restaurantId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const getProductById = productId => {
  return new Promise((resolve, reject) => {
    Product.getProductById(productId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}


module.exports = {
  getAllProducts,
  postNewProducts,
  editProductById,
  deleteProductById,
  getAllRestaurantProducts,
  getProductById
};
