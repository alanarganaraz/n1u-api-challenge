const { filterScheduleData } = require('../common/Util');
const DB = require('./database');
const { v4: uuidv4 } = require('uuid');

const updatePromotion = (promotionId, promotionData) => {
  return new Promise((resolve, reject) => {
    if (!promotionData) {
      resolve();
    } else {
      let updateFields = [];
      let queryParams = [];

      if (promotionData.description) {
        updateFields.push('description = ?');
        queryParams.push(promotionData.description);
      }
      if (promotionData.promotion_price) {
        updateFields.push('promotion_price = ?');
        queryParams.push(promotionData.promotion_price);
      }
      if (updateFields.lenght === 0) {
        resolve();
      } else {
        const updateQuery = `UPDATE promotion SET ${updateFields.join(
          ', ',
        )} WHERE id = ?`;
        queryParams.push(promotionId);

        DB.query(updateQuery, queryParams)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    }
  });
};

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

const updatePromotionSchedule = scheduleData => {
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
          const { closingHourId, weekdayId, openingHourId } =
            await filterScheduleData(scheduleData);
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

          const updateQuery = `UPDATE promotion_schedule SET ${updateFields.join(
            ', ',
          )} WHERE id = ?`;
          queryParams.push(schedule.id);

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

const deletePromotionById = promotionId => {
  return new Promise((resolve, reject) => {
    DB.query('DELETE FROM promotion WHERE id = ?', [promotionId])
      .then(() => {
        resolve(promotionId);
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
        ])
          .then(async ([promotionSchedule]) => {
            let data;
            await Promise.all(
              promotion.map(async result => {
                const scheduleData = await Promise.all(
                  promotionSchedule.map(async promotionSchedule => {
                    const schedule = {
                      weekday_id: promotionSchedule.weekday_promotion,
                      opening_hour: promotionSchedule.opening_promotion_hour,
                      closing_hour: promotionSchedule.closing_promotion_hour,
                    };
                    return formatSchedule(schedule);
                  }),
                );

                data = {
                  promotionId: result.id,
                  description: result.description,
                  promotionPrice: result.promotion_price,
                  weekdayPromotion: scheduleData[0].weekday,
                  openingPromotion: scheduleData[0].opening_hour,
                  closingPromotion: scheduleData[0].closing_hour,
                };
              }),
            );

            resolve(data);
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
            resolve(promotionId);
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

const editPromotionById = ({
  promotionId,
  promotionData,
  promotionScheduleData,
}) => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([
        updatePromotion(promotionId, promotionData),
        updatePromotionSchedule(promotionScheduleData),
      ])
        .then(() => resolve(promotionId))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postNewPromotion,
  getPromotionById,
  deletePromotionById,
  editPromotionById,
};
