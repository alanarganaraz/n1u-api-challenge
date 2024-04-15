const { filterScheduleData } = require('../common/Util');
const DB = require('./database');
const { v4: uuidv4 } = require('uuid');

const updatePromotion = (promotionId, promotionData) => {
  return new Promise((resolve, reject) => {
    if (!promotionData) {
      resolve();
    } else {
      DB.query(
        'UPDATE promotion SET description = ?, promotion_price = ? WHERE id = ?',
        [
          promotionData.description,
          promotionData.promotion_price,
          promotionId,
        ]
      )
        .then(() => resolve())
        .catch(error => reject(error));
    }
  });
};


const updatePromotionSchedule = (promotionId, scheduleData) => {
  return new Promise(async (resolve, reject) => {
    if (!scheduleData) {
      resolve();
    } else {
      try {
        const updatePromises = scheduleData.map(async schedule => {
          const scheduleData = {
            weekday: schedule.weekday_promotion,
            opening_hour: schedule.opening_promotion_hour,
            closing_hour: schedule.closing_promotion_hour,
          };
          const { closingHourId, weekdayId, openingHourId } = await filterScheduleData(scheduleData);
          const updateFields = [];
          const queryParams = [];
          
          if (weekdayId !== undefined) {
            updateFields.push('weekday_promotion = ?');
            queryParams.push(weekdayId);
          }
          if (openingHourId !== undefined) {
            updateFields.push('opening_promotion_hour = ?');
            queryParams.push(openingHourId);
          }
          if (closingHourId !== undefined) {
            updateFields.push('closing_promotion_hour = ?');
            queryParams.push(closingHourId);
          }
          
          if (updateFields.length === 0) {
            return;
          }
          
          const updateQuery = `UPDATE promotion_schedule SET ${updateFields.join(', ')} WHERE id = ?`;
          queryParams.push(schedule.id, promotionId);

          return DB.query(updateQuery, queryParams);
        });

        await Promise.all(updatePromises);
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  });
};


const updateProduct = (productId, categoryId, productData) => {
  return new Promise((resolve, reject) => {
    if (!productData) {
      resolve();
    } else {
      let updateFields = [];
      let queryParams = [];
      
      if (categoryId) {
        updateFields.push('id_category = ?');
        queryParams.push(categoryId);
      }
      if (productData.image) {
        updateFields.push('image = ?');
        queryParams.push(productData.image);
      }
      if (productData.name) {
        updateFields.push('name = ?');
        queryParams.push(productData.name);
      }
      if (productData.price) {
        updateFields.push('price = ?');
        queryParams.push(productData.price);
      }

      if (updateFields.length === 0) {
        resolve();
      } else {
        const updateQuery = `UPDATE product SET ${updateFields.join(', ')} WHERE id = ?`;
        queryParams.push(productId);
        console.log("🚀 ~ returnnewPromise ~ updateQuery:", updateQuery)
        
        DB.query(updateQuery, queryParams)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    }
  });
};

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * FROM product')
      .then(([results]) => resolve(results))
      .catch(err => {
        reject(err);
      });
  });
};

const postNewProducts = ({ restaurantId, categoryId, productData }) => {
  return new Promise((resolve, reject) => {
    const productId = uuidv4();
    DB.query(
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)',
      [
        productId,
        restaurantId,
        categoryId,
        productData.image,
        productData.name,
        productData.price,
      ],
    )
      .then(([]) => resolve(true))
      .catch(err => {
        reject(err);
      });
  });
};

const editProductById = ({ productId, categoryId, productData }) => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([
        updateProduct(productId, categoryId, productData),
      ])
        .then(() => resolve(true))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProductById = productId => {
  return new Promise((resolve, reject) => {
    DB.query('DELETE FROM product WHERE id = ?', [productId])
      .then(([]) => resolve(true))
      .catch(err => {
        reject(err);
      });
  });
};

const deletePromotionById = promotionId => {
  return new Promise((resolve, reject) => {
    DB.query('DELETE FROM promotion_schedule WHERE id_promotion = ?', [
      promotionId,
    ])
      .then(([]) => {
        DB.query('DELETE FROM promotion WHERE id = ?', [promotionId])
          .then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getPromotionById = promotionId => {
  return new Promise((resolve, reject) => {
    DB.query('SELECT * from promotion WHERE id = ?', [promotionId])
      .then(([promotion]) => {
        DB.query('SELECT * from promotion_schedule WHERE id_promotion = ?', [
          promotionId,
        ]).then(([promotionSchedule]) => {
          let data;
          promotion.map(result => {
            promotionSchedule.map(promotionSchedule => {
              data = {
                promotionId: result.id,
                description: result.description,
                promotionPrice: result.promotionPrice,
                weekdayPromotion: promotionSchedule.weekday_promotion,
                openingPromotion: promotionSchedule.opening_promotion_hour,
                closing_promotion_hour:
                  promotionSchedule.closing_promotion_hour,
              };
            });
          });
          resolve(data).catch(err => {
            reject(err);
          });
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postNewPromotion = ({
  productId,
  description,
  promotionPrice,
  weekdayPromotion,
  openPromotionHour,
  closePromotionHour,
}) => {
  return new Promise((resolve, reject) => {
    const promotionId = uuidv4();
    const promotionScheduleId = uuidv4();
    DB.query(
      'INSERT INTO promotion (id, id_product, description, promotion_price) VALUES (?, ?, ?, ?)',
      [promotionId, productId, description, promotionPrice],
    )
      .then(async () => {
        const schedule = {
          weekday: weekdayPromotion,
          opening_hour: openPromotionHour,
          closing_hour: closePromotionHour,
        };
        const { closingHourId, weekdayId, openingHourId } =
          await filterScheduleData(schedule);
        DB.query(
          'INSERT INTO promotion_schedule (id, id_promotion, weekday_promotion, opening_promotion_hour, closing_promotion_hour) VALUES (?, ?, ?, ?, ?)',
          [
            promotionScheduleId,
            promotionId,
            weekdayId,
            openingHourId,
            closingHourId,
          ],
        )
          .then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const editPromotionById = ({ promotionId, promotionData, promotionScheduleData }) => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([
        updatePromotion(promotionId, promotionData),
        updatePromotionSchedule(promotionId, promotionScheduleData),
      ])
        .then(() => resolve(true))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
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
