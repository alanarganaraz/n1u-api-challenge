const productServices = require('../services/productServices');

const getAllProducts = (req, res) => {
  return new Promise(() => {
    productServices
      .getAllProducts()
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
};

const postNewProducts = (req, res) => {
  const { restaurantId, categoryId, productData } = req.body;
  return new Promise(() => {
    const payload = {
      restaurantId,
      categoryId,
      productData,
    };
    productServices
      .postNewProducts(payload)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
};

const editProductById = (req, res) => {
  const { categoryId, productData } = req.body;
  const { productId } = req.params;
  if (!productId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    const payload = {
      productId,
      categoryId,
      productData,
    };
    productServices
      .editProductById(payload)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
};

const deleteProductById = (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    productServices
      .deleteProductById(productId)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
};

const getAllRestaurantProducts = (req, res) => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    productServices
      .getAllRestaurantProducts(restaurantId)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
}

const getProductById = (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    productServices
      .getProductById(productId)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
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
