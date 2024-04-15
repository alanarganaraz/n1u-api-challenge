const promotionServices = require('../services/promotionServices');

const getPromotionById = (req, res) => {
  const { promotionId } = req.params;
  if (!promotionId) {
    const message = 'Params is required.';
    return res.status(400).send({ status: 'FAILED', data: { error: message } });
  }
  return new Promise(() => {
    promotionServices
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
    promotionServices
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
    promotionServices
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
    promotionServices
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
  getPromotionById,
  postNewPromotion,
  deletePromotionById,
  editPromotionById,
};
