const restaurantService = require('../services/restaurantServices');

const getAllRestaurants = (req, res) => {
  return new Promise(() => {
    restaurantService
      .getAllRestaurants()
      .then(data => {
        res.send({ status: 'oki', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || err } });
      });
  });
};

const getRestaurantById = (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    const message = "Params is required."
    return res.status(400).send({ status: 'FAILED', data: { error: message } })
  }

  return new Promise(() => {
    restaurantService
      .getRestaurantById(restaurantId)
      .then(data => {
        res.send({ status: 'OK', data });
      })
      .catch(err => {
        res
          .status(err?.status || 500)
          .send({ status: 'FAILED', data: { error: err?.message || error } });
      });
  });
};

const deleteRestaurantById = (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    const message = "Params is required."
    return res.status(400).send({ status: 'FAILED', data: { error: message } })
  }

  return new Promise(() => {
    restaurantService
      .deleteRestaurantById(restaurantId)
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

const postRestaurant = (req, res) => {
  const { restaurantData, addressData, scheduleData } = req.body;
  return new Promise(() => {
    restaurantService
      .postRestaurant(restaurantData, addressData, scheduleData)
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

const editRestaurantById = (req, res) => {
  const { restaurantData, addressData, scheduleData } = req.body;
  const { restaurantId } = req.params;
  if (!restaurantId) {
    const message = "Params is required."
    return res.status(400).send({ status: 'FAILED', data: { error: message } })
  }
  return new Promise(() => {
    restaurantService
      .editRestaurantById(
        restaurantId,
        restaurantData,
        addressData,
        scheduleData,
      )
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
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurantById,
  postRestaurant,
  editRestaurantById,
};
