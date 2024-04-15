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

const getPromotionById = (req, res) => {
  const { promotionId } = req.params;
  if (!promotionId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    productServices
      .getPromotionById(promotionId)
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

const deletePromotionById = (req, res) => {
  const { promotionId } = req.params;
  if (!promotionId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    productServices
      .deletePromotionById(promotionId)
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

const editPromotionById = (req, res) => {
  const { promotionId } = req.params;
  const { promotionData, promotionScheduleData } = req.body;
  if (!promotionId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    const payload = {
      promotionId,
      promotionData,
      promotionScheduleData,
    };
    productServices
      .editPromotionById(payload)
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

const postNewPromotion = (req, res) => {
  const {
    productId,
    description,
    promotionPrice,
    weekdayPromotion,
    openPromotionHour,
    closePromotionHour,
  } = req.body;
  return new Promise(() => {
    const payload = {
      productId,
      description,
      promotionPrice,
      weekdayPromotion,
      openPromotionHour,
      closePromotionHour,
    };
    productServices
      .postNewPromotion(payload)
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

module.exports = {
  getAllProducts,
  postNewProducts,
  editProductById,
  deleteProductById,
  getPromotionById,
  postNewPromotion,
  deletePromotionById,
  editPromotionById,
};
