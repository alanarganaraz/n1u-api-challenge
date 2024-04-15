const Restaurant = require('../databases/restaurant');

const getAllRestaurants = () => {
  return new Promise((resolve, reject) => {
    Restaurant.getAllRestaurants()
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getRestaurantById = restaurantId => {
  return new Promise((resolve, reject) => {
    Restaurant.getRestaurantById(restaurantId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const deleteRestaurantById = restaurantId => {
  return new Promise((resolve, reject) => {
    Restaurant.deleteRestaurantById(restaurantId)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postRestaurant = (restaurantData, addressData, scheduleData) => {
  return new Promise((resolve, reject) => {
    Restaurant.postRestaurant(restaurantData, addressData, scheduleData)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const editRestaurantById = (
  restaurantId,
  restaurantData,
  addressData,
  scheduleData,
) => {
  return new Promise((resolve, reject) => {
    Restaurant.editRestaurantById(
      restaurantId,
      restaurantData,
      addressData,
      scheduleData,
    )
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
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
