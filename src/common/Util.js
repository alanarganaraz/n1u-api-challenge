const DB = require('../databases/database');

const createError = (status = 500, message = 'Ha ocurrido un error.') => {
  return {
    status: status,
    data: {
      error: true,
      status: status,
      message: message,
    },
  };
};

const filterScheduleData = schedule => {
  return Promise.all([
    DB.query('SELECT id FROM weekday WHERE name = ?', [schedule.weekday]),
    DB.query('SELECT id FROM hour_of_day WHERE hour = ?', [
      schedule.opening_hour,
    ]),
    DB.query('SELECT id FROM hour_of_day WHERE hour = ?', [
      schedule.closing_hour,
    ]),
  ])
    .then(([weekdayIdResult, openingHourIdResult, closingHourIdResult]) => {
      let weekdayId, openingHourId, closingHourId;

      if (weekdayIdResult[0].length > 0) {
        weekdayId = weekdayIdResult[0][0].id;
      }

      if (openingHourIdResult[0].length > 0) {
        openingHourId = openingHourIdResult[0][0].id;
      }

      if (closingHourIdResult[0].length > 0) {
        closingHourId = closingHourIdResult[0][0].id;
      } 

      const scheduleData = {
        weekdayId,
        openingHourId,
        closingHourId,
      };

      return scheduleData;
    })
    .catch(error => {
      throw error;
    });
};

module.exports = {
    createError,
    filterScheduleData
}