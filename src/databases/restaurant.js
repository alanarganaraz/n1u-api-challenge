const { filterScheduleData } = require('../common/Util');
const DB = require('./database');
const { v4: uuidv4 } = require('uuid');

const updateRestaurant = (restaurantId, restaurantData) => {
  return new Promise((resolve, reject) => {
    if (!restaurantData) {
      resolve();
    } else {
      let updateFields = [];
      let queryParams = [];

      if (restaurantData.image) {
        updateFields.push('image = ?');
        queryParams.push(restaurantData.image);
      }
      if (restaurantData.name) {
        updateFields.push('name = ?');
        queryParams.push(restaurantData.name);
      }
      if (restaurantData.number) {
        updateFields.push('number = ?');
        queryParams.push(restaurantData.number);
      }
      if (restaurantData.rating) {
        updateFields.push('rating = ?');
        queryParams.push(restaurantData.rating);
      }

      if (updateFields.length === 0) {
        resolve();
      } else {
        const updateQuery = `UPDATE restaurant SET ${updateFields.join(
          ', ',
        )} WHERE id = ?`;
        queryParams.push(restaurantId);

        DB.query(updateQuery, queryParams)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    }
  });
};

const updateAddress = (restaurantId, addressData) => {
  return new Promise((resolve, reject) => {
    if (!addressData) {
      resolve();
    } else {
      let updateFields = [];
      let queryParams = [];

      if (addressData.street_name) {
        updateFields.push('street_name = ?');
        queryParams.push(addressData.street_name);
      }
      if (addressData.street_number) {
        updateFields.push('street_number = ?');
        queryParams.push(addressData.street_number);
      }
      if (addressData.province) {
        updateFields.push('province = ?');
        queryParams.push(addressData.province);
      }
      if (addressData.zip_code) {
        updateFields.push('zip_code = ?');
        queryParams.push(addressData.zip_code);
      }

      if (updateFields.length === 0) {
        resolve();
      } else {
        const updateQuery = `UPDATE address SET ${updateFields.join(
          ', ',
        )} WHERE id_restaurant = ?`;
        queryParams.push(restaurantId);

        DB.query(updateQuery, queryParams)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    }
  });
};

const updateSchedule = (restaurantId, scheduleData) => {
  return new Promise(async (resolve, reject) => {
    if (!scheduleData) {
      resolve();
    } else {
      try {
        for (const schedule of scheduleData) {
          const { closingHourId, weekdayId, openingHourId } =
            await filterScheduleData(schedule);
          const updateFields = [];
          const queryParams = [];

          if (weekdayId !== undefined) {
            updateFields.push('weekday_id = ?');
            queryParams.push(weekdayId);
          }
          if (openingHourId !== undefined) {
            updateFields.push('opening_hour = ?');
            queryParams.push(openingHourId);
          }
          if (closingHourId !== undefined) {
            updateFields.push('closing_hour = ?');
            queryParams.push(closingHourId);
          }

          if (updateFields.length === 0) {
            continue;
          }

          const updateQuery = `UPDATE restaurant_schedule SET ${updateFields.join(
            ', ',
          )} WHERE id = ? AND id_restaurant = ?`;
          queryParams.push(schedule.id, restaurantId);

          await DB.query(updateQuery, queryParams);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  });
};

const formatAddress = address => ({
  street_name: address.street_name,
  street_number: address.street_number,
  province: address.province,
  zip_code: address.zip_code,
});

const formatSchedule = schedule => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT name FROM weekday WHERE id = ?', [schedule.weekday_id])
      .then(([weekday]) => {
        DB.query('SELECT hour FROM hour_of_day WHERE id = ?', [
          schedule.opening_hour,
        ])
          .then(([opening]) => {
            DB.query('SELECT hour FROM hour_of_day WHERE id = ?', [
              schedule.closing_hour,
            ])
              .then(([closing]) => {
                console.log(weekday);
                const data = {
                  id: schedule.id,
                  id_restaurant: schedule.id_restaurant,
                  weekday: weekday[0].name,
                  opening_hour: opening[0].hour,
                  closing_hour: closing[0].hour, 
                };
                resolve(data);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};


const getRestaurantSchedule = restaurantId => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * FROM restaurant_schedule WHERE id_restaurant = ?', [
      restaurantId,
    ])
      .then(async ([schedules]) => {
        const data = await Promise.all(schedules.map(formatSchedule));


        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getRestaurantData = (results, includeSchedule = true) => {
  return new Promise((resolve, reject) => {
    const promises = results.map(result => {
      return getAddressByRestaurantId(result.id).then(address => {
        const formattedAddress = address.map(formatAddress);
        const formattedData = {
          id: result.id,
          image: result.image,
          name: result.name,
          number: result.number,
          rating: result.rating,
          address: formattedAddress,
        };
        if (includeSchedule) {
          return getRestaurantSchedule(result.id).then(schedule => {
            formattedData.schedule = schedule;
            return formattedData;
          });
        } else {
          return formattedData;
        }
      });
    });

    Promise.all(promises)
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
};

const getAddressByRestaurantId = restaurantId => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * FROM address WHERE id_restaurant = ?', [restaurantId])
      .then(([addresses]) => resolve(addresses))
      .catch(error => {
        reject(error);
      });
  });
};

const getAllRestaurants = () => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * FROM restaurant')
      .then(([results]) => resolve(getRestaurantData(results)))
      .catch(err => {
        reject(err);
      });
  });
};

const getRestaurantById = restaurantId => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * FROM restaurant WHERE id = ?', [restaurantId])
      .then(([results]) => resolve(getRestaurantData(results)))
      .catch(err => {
        reject(err);
      });
  });
};

const deleteRestaurantById = restaurantId => {
  return new Promise((resolve, reject) => {
    DB.query(`DELETE FROM restaurant WHERE id = ?`, [restaurantId])
      .then(() => {
        resolve(restaurantId);
      })
      .catch(error => {
        reject(error);
      });
  });
};


const postRestaurant = (restaurantData, addressData, scheduleData) => {
  return new Promise((resolve, reject) => {
    const restaurantId = uuidv4();
    const addressId = uuidv4();

    DB.query(
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)',
      [
        restaurantId,
        restaurantData.image,
        restaurantData.name,
        restaurantData.number,
        restaurantData.rating,
      ],
    )
      .then(() => {
        return DB.query(
          'INSERT INTO address (id, id_restaurant, street_name, street_number, province, zip_code) VALUES (?, ?, ?, ?, ?, ?)',
          [
            addressId,
            restaurantId,
            addressData.street_name,
            addressData.street_number,
            addressData.province,
            addressData.zip_code,
          ],
        );
      })
      .then(() => {
        const schedulePromises = scheduleData.map(async schedule => {
          const scheduleId = uuidv4();
          const { closingHourId, weekdayId, openingHourId } =
            await filterScheduleData(schedule);
          return DB.query(
            'INSERT INTO restaurant_schedule (id, id_restaurant, weekday_id, opening_hour, closing_hour) VALUES (?, ?, ?, ?, ?)',
            [scheduleId, restaurantId, weekdayId, openingHourId, closingHourId],
          );
        });
        return Promise.all(schedulePromises);
      })
      .then(() => {
        resolve(restaurantId);
      })
      .catch(error => {
        reject(error);
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
    try {
      Promise.all([
        updateRestaurant(restaurantId, restaurantData),
        updateAddress(restaurantId, addressData),
        updateSchedule(restaurantId, scheduleData),
      ])
        .then(() => resolve(restaurantId))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurantById,
  postRestaurant,
  editRestaurantById,
};
