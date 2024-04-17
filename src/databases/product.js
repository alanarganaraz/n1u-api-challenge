const DB = require('./database');
const { v4: uuidv4 } = require('uuid');

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
        const updateQuery = `UPDATE product SET ${updateFields.join(
          ', ',
        )} WHERE id = ?`;
        queryParams.push(productId);

        DB.query(updateQuery, queryParams)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    }
  });
};

const getAllProducts = (offset = 0, limit = 10) => {
  return new Promise((resolve, reject) => {
    DB.query(
      `
      SELECT 
        product.*,
        promotion.id AS promotion_id,
        promotion.description AS promotion_description,
        promotion.promotion_price,
        promotion_schedule.weekday_promotion,
        opening_hour.hour AS opening_promotion_hour,
        closing_hour.hour AS closing_promotion_hour
      FROM 
        product
      LEFT JOIN 
        promotion ON product.id = promotion.id_product
      LEFT JOIN 
        promotion_schedule ON promotion.id = promotion_schedule.id_promotion
      LEFT JOIN 
        hour_of_day AS opening_hour ON promotion_schedule.opening_promotion_hour = opening_hour.id
      LEFT JOIN 
        hour_of_day AS closing_hour ON promotion_schedule.closing_promotion_hour = closing_hour.id
      LIMIT ?, ?
    `,
      [parseInt(offset), parseInt(limit)]
    )
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
      .then(([]) => resolve(productId))
      .catch(err => {
        reject(err);
      });
  });
};

const editProductById = ({ productId, categoryId, productData }) => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([updateProduct(productId, categoryId, productData)])
        .then(() => resolve(productId))
        .catch(error => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProductById = productId => {
  return new Promise((resolve, reject) => {
    DB.query('DELETE FROM product WHERE id = ?', [productId])
      .then(([]) => resolve(productId))
      .catch(err => {
        reject(err);
      });
  });
};

const getAllRestaurantProducts = (restaurantId, offset = 0, limit = 10) => {
  return new Promise((resolve, reject) => {
    DB.query(
      `
      SELECT 
        product.*,
        promotion.id AS promotion_id,
        promotion.description AS promotion_description,
        promotion.promotion_price,
        weekday_name.name AS weekday_promotion_name,
        opening_hour.hour AS opening_promotion_hour,
        closing_hour.hour AS closing_promotion_hour
      FROM 
        product
      LEFT JOIN 
        promotion ON product.id = promotion.id_product
      LEFT JOIN 
        promotion_schedule ON promotion.id = promotion_schedule.id_promotion
      LEFT JOIN 
        hour_of_day AS opening_hour ON promotion_schedule.opening_promotion_hour = opening_hour.id
      LEFT JOIN 
        hour_of_day AS closing_hour ON promotion_schedule.closing_promotion_hour = closing_hour.id
      LEFT JOIN 
        weekday AS weekday_name ON promotion_schedule.weekday_promotion = weekday_name.id
      WHERE 
        product.id_restaurant = ?
      LIMIT ?, ?
    `,
      [restaurantId, parseInt(offset), parseInt(limit)],
    )
    
      .then(([products]) => {
        return resolve(products)
      })
      .catch(err => {
        reject(err);
      });
  });
};


const getProductById = productId => {
  return new Promise((resolve, reject) => {
    DB.query(
      `
      SELECT 
        product.*,
        promotion.id AS promotion_id,
        promotion.description AS promotion_description,
        promotion.promotion_price,
        promotion_schedule.weekday_promotion,
        opening_hour.hour AS opening_promotion_hour,
        closing_hour.hour AS closing_promotion_hour
      FROM 
        product
      LEFT JOIN 
        promotion ON product.id = promotion.id_product
      LEFT JOIN 
        promotion_schedule ON promotion.id = promotion_schedule.id_promotion
      LEFT JOIN 
        hour_of_day AS opening_hour ON promotion_schedule.opening_promotion_hour = opening_hour.id
      LEFT JOIN 
        hour_of_day AS closing_hour ON promotion_schedule.closing_promotion_hour = closing_hour.id
      WHERE 
        product.id = ?
    `,
      [productId],
    )
      .then(([products]) => resolve(products))
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  getAllProducts,
  postNewProducts,
  editProductById,
  deleteProductById,
  getAllRestaurantProducts,
  getProductById,
};
