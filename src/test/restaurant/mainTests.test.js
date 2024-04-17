'use strict';
const request = require('supertest');
const app = require('../../index');
const db = require('../../databases/database');

describe('GET api/v1/restaurants', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['1', 'jpg.jpg', 'hola', '123', 4];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['1'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  it('ERROR /api/v1/restaurants - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/restaurants');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/restaurants - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .get('/api/v1/restaurants')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/v1/restaurants - should return 200 with restaurant ID 1', async () => {
    const res = await request(app)
      .get('/api/v1/restaurants/1')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const restaurant = res.body.data[0];
    expect(restaurant).toHaveProperty('id', '1');
    expect(restaurant).toHaveProperty('image', 'jpg.jpg');
    expect(restaurant).toHaveProperty('name', 'hola');
    expect(restaurant).toHaveProperty('number', '123');
    expect(restaurant).toHaveProperty('rating', 4);
  });
});

describe('GET BY LIMIT AND OFFSERT api/v1/restaurants?limit&offset', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['1', 'jpg.jpg', 'hola', '123', 4];
    const sql2 =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values2 = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sql3 =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values3 = ['3', 'jpg.jpg', 'hola', '123', 4];
    try {
      await db.query(sql, values);
      await db.query(sql2, values2);
      await db.query(sql3, values3);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['1'];
    const sql2 = 'DELETE FROM restaurant WHERE id = ?';
    const values2 = ['2'];
    const sql3 = 'DELETE FROM restaurant WHERE id = ?';
    const values3 = ['3'];
    try {
      await db.query(sql, values);
      await db.query(sql2, values2);
      await db.query(sql3, values3);
    } catch (error) {
      throw error;
    }
  });

  it('GET /api/v1/restaurants?limit&offset - should return 200 with restaurant ID 1', async () => {
    const res = await request(app)
      .get('/api/v1/restaurants?limit=3&offset=1')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');

    const restaurant = res.body.data;
    expect(restaurant[0]).toHaveProperty('id', '2');
    expect(restaurant[0]).toHaveProperty('image', 'jpg.jpg');
    expect(restaurant[0]).toHaveProperty('name', 'hola');
    expect(restaurant[0]).toHaveProperty('number', '123');
    expect(restaurant[0]).toHaveProperty('rating', 4);

    expect(restaurant[1]).toHaveProperty('id', '3');
    expect(restaurant[1]).toHaveProperty('image', 'jpg.jpg');
    expect(restaurant[1]).toHaveProperty('name', 'hola');
    expect(restaurant[1]).toHaveProperty('number', '123');
    expect(restaurant[1]).toHaveProperty('rating', 4);
  });
});

describe('POST api/v1/restaurants', () => {
  it('ERROR /api/v1/restaurants - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/restaurants');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/restaurants - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });
  let lastRestaurant;

  it('POST /api/v1/restaurants - should return 200 with restaurant ID 1', async () => {
    const restaurantData = {
      image: 'asdasdasd.jpg',
      name: 'hola',
      number: '123',
      rating: 2,
    };

    const addressData = {
      street_name: 'paraguay',
      street_number: '500',
      province: 'Buenos Aires',
      zip_code: '1704',
    };

    const scheduleData = [
      {
        weekday: 'Lunes',
        opening_hour: '09:00',
        closing_hour: '19:00',
      },
    ];

    const resPost = await request(app)
      .post('/api/v1/restaurants/')
      .send({ restaurantData, addressData, scheduleData })
      .set('api-key', '1234');

    lastRestaurant = resPost.body.data;

    expect(resPost.statusCode).toEqual(200);
    expect(resPost.body.status).toEqual('OK');
    expect(resPost.body.data).toEqual(lastRestaurant);

    const resGet = await request(app)
      .get(`/api/v1/restaurants/${lastRestaurant}`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const restaurant = resGet.body.data[0];
    expect(restaurant).toHaveProperty('id', lastRestaurant);
    expect(restaurant).toHaveProperty('image', 'asdasdasd.jpg');
    expect(restaurant).toHaveProperty('name', 'hola');
    expect(restaurant).toHaveProperty('number', '123');
    expect(restaurant).toHaveProperty('rating', 2);
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = [lastRestaurant];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('PATCH api/v1/restaurants', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['160', 'jpg.jpg', 'hola', '123', 4];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/restaurants - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/restaurants');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/restaurants - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('PATCH /api/v1/restaurants/:id - should return 200 with restaurant ID 1', async () => {
    const restaurantData = {
      name: 'DATAEDITADA',
    };

    const resPatch = await request(app)
      .patch(`/api/v1/restaurants/160`)
      .send({ restaurantData })
      .set('api-key', '1234');

    expect(resPatch.statusCode).toEqual(200);
    expect(resPatch.body.data).toEqual('160');

    const resGet = await request(app)
      .get(`/api/v1/restaurants/160`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const restaurant = resGet.body.data[0];
    expect(restaurant).toHaveProperty('id', '160');
    expect(restaurant).toHaveProperty('image', 'jpg.jpg');
    expect(restaurant).toHaveProperty('name', 'DATAEDITADA');
    expect(restaurant).toHaveProperty('number', '123');
    expect(restaurant).toHaveProperty('rating', 4);
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['160'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('DELETE api/v1/restaurants', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['190', 'jpg.jpg', 'DELETED', '123', 4];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/restaurants - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/restaurants');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/restaurants - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('DELETE /api/v1/restaurants/:id - should delete the restaurant from lastRestaurant', async () => {
    const resDelete = await request(app)
      .delete(`/api/v1/restaurants/190`)
      .set('api-key', '1234');

    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.data).toEqual('190');
  });
  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['190'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('GET api/v1/product', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '2', 3, '123.jpg', 'hola producto 2', 5];
    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  it('ERROR /api/v1/products - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/products - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/v1/products - should return 200 with product ID 1', async () => {
    const res = await request(app)
      .get('/api/v1/products/1')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const product = res.body.data[0];
    expect(product).toHaveProperty('id', '1');
    expect(product).toHaveProperty('id_restaurant', '2');
    expect(product).toHaveProperty('id_category', '3');
    expect(product).toHaveProperty('image', '123.jpg');
  });

  it('GET /api/v1/products/restaurant/:idRestaurant - should return 200 with all restaurant products', async () => {
    const res = await request(app)
      .get('/api/v1/products/restaurant/2')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const product = res.body.data;
    expect(product[0]).toHaveProperty('id', '1');
    expect(product[0]).toHaveProperty('id_restaurant', '2');
    expect(product[0]).toHaveProperty('id_category', '3');
    expect(product[0]).toHaveProperty('image', '123.jpg');
    expect(product[0]).toHaveProperty('name', 'hola producto');

    expect(product[1]).toHaveProperty('id', '2');
    expect(product[1]).toHaveProperty('id_restaurant', '2');
    expect(product[1]).toHaveProperty('id_category', '3');
    expect(product[1]).toHaveProperty('image', '123.jpg');
    expect(product[1]).toHaveProperty('name', 'hola producto 2');
  });
});

describe('GET BY LIMIT AND OFFSET api/v1/products?limit&offset', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['1', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '1', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '1', 3, '123.jpg', 'hola producto 2', 5];
    try {
      await db.query(sql, values);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['1'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  it('GET /api/v1/products?limit&offset - should return 200 with products limit and offset', async () => {
    const res = await request(app)
      .get('/api/v1/products?limit=1&offset=1')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');

    const product = res.body.data[0];

    expect(product).toHaveProperty('id_restaurant', '1');
    expect(product).toHaveProperty('id_category', '3');
    expect(product).toHaveProperty('image', '123.jpg');
    expect(product).toHaveProperty('name', 'hola producto 2');
  });
});

describe('GET BY LIMIT AND OFFSET api/v1/products/restaurant/:id?limit&offset', () => {
  beforeEach(async () => {
    const sql =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const values = ['1', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '1', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '1', 3, '123.jpg', 'hola producto 2', 5];
    
    try {
      await db.query(sql, values);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['1'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  it('GET /api/v1/products/restaurant/:id?limit&offset - should return 200 with products limit and offset', async () => {
    const res = await request(app)
      .get('/api/v1/products/restaurant/1?limit=1&offset=0')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');

    const product = res.body.data[0];

    expect(product).toHaveProperty('id_restaurant', '1');
    expect(product).toHaveProperty('id_category', '3');
    expect(product).toHaveProperty('image', '123.jpg');
    expect(product).toHaveProperty('name', 'hola producto');
  });
});

describe('POST api/v1/products', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    try {
      await db.query(sqlRestrurant, valuesRestaurant);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/products - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/products - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });
  let lastProduct;

  it('POST /api/v1/products - should return 200 with product ID 1', async () => {
    const productData = {
      image: 'image.jpg',
      name: 'producto',
      price: 2,
    };

    const resPost = await request(app)
      .post('/api/v1/products/')
      .send({ productData, restaurantId: '2', categoryId: 3 })
      .set('api-key', '1234');

    lastProduct = resPost.body.data;

    expect(resPost.statusCode).toEqual(200);
    expect(resPost.body.status).toEqual('OK');
    expect(resPost.body.data).toEqual(lastProduct);

    const resGet = await request(app)
      .get(`/api/v1/products/${lastProduct}`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const product = resGet.body.data[0];

    expect(product).toHaveProperty('id', lastProduct);
    expect(product).toHaveProperty('id_restaurant', '2');
    expect(product).toHaveProperty('id_category', '3');
    expect(product).toHaveProperty('image', 'image.jpg');
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('PATCH api/v1/products', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/products - should return 403 without api-key', async () => {
    const res = await request(app).patch('/api/v1/products');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/products - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .patch('/api/v1/products')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('PATCH /api/v1/products/:id - should return 200 with product ID 1', async () => {
    const productData = {
      name: 'DATAEDITADA producto',
    };

    const resPatch = await request(app)
      .patch(`/api/v1/products/1`)
      .send({ categoryId: 4, productData })
      .set('api-key', '1234');

    expect(resPatch.statusCode).toEqual(200);
    expect(resPatch.body.data).toEqual('1');

    const resGet = await request(app)
      .get(`/api/v1/products/1`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const product = resGet.body.data[0];
    expect(product).toHaveProperty('name', 'DATAEDITADA producto');
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('DELETE api/v1/products', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/products - should return 403 without api-key', async () => {
    const res = await request(app).delete('/api/v1/products');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/products - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .delete('/api/v1/products')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('DELETE /api/v1/products/:id - should delete the product from lastRestaurant', async () => {
    const resDelete = await request(app)
      .delete(`/api/v1/products/1`)
      .set('api-key', '1234');

    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.data).toEqual('1');
  });
  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('GET api/v1/promotions', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '2', 3, '123.jpg', 'hola producto 2', 5];

    const sqlPromotion =
      'INSERT INTO promotion (id, id_product, description, promotion_price) VALUES (?, ?, ?, ?)';
    const valuesPromotion = ['50', '2', 'hola promo', 5000];

    const sqlPromotionSchedule =
      'INSERT INTO promotion_schedule (id, id_promotion, weekday_promotion, opening_promotion_hour, closing_promotion_hour) VALUES (?, ?, ?, ?, ?)';
    const valuesPromotionSchedule = ['100', '50', 3, 20, 20];

    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
      await db.query(sqlPromotion, valuesPromotion);
      await db.query(sqlPromotionSchedule, valuesPromotionSchedule);
    } catch (error) {
      throw error;
    }
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });

  it('ERROR /api/v1/promotions - should return 403 without api-key', async () => {
    const res = await request(app).get('/api/v1/promotions');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/promotions - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .get('/api/v1/promotions')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/v1/promotions - should return 200 with promotion ID 50', async () => {
    const res = await request(app)
      .get('/api/v1/promotions/50')
      .set('api-key', '1234');

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');

    const product = res.body.data;
    expect(product).toHaveProperty('promotionId', '50');
    expect(product).toHaveProperty('description', 'hola promo');
    expect(product).toHaveProperty('weekdayPromotion', 'Miércoles');
    expect(product).toHaveProperty('openingPromotion', '04:45');
    expect(product).toHaveProperty('closingPromotion', '04:45');
  });
});

describe('POST api/v1/promotions', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/promotions - should return 403 without api-key', async () => {
    const res = await request(app).post('/api/v1/promotions');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/promotions - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .post('/api/v1/promotions')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });
  let lastPromotion;

  it('POST /api/v1/promotions - should return 200 with promotion ID 1', async () => {
    const resPost = await request(app)
      .post('/api/v1/promotions/')
      .send({
        productId: '1',
        description: 'producto promo',
        promotionPrice: 2.2,
        weekdayPromotion: 'Lunes',
        openPromotionHour: '01:00',
        closePromotionHour: '02:00',
      })
      .set('api-key', '1234');

    lastPromotion = resPost.body.data;

    expect(resPost.statusCode).toEqual(200);
    expect(resPost.body.status).toEqual('OK');
    expect(resPost.body.data).toEqual(lastPromotion);

    const resGet = await request(app)
      .get(`/api/v1/promotions/${lastPromotion}`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const product = resGet.body.data;

    expect(product).toHaveProperty('description', 'producto promo');
    expect(product).toHaveProperty('promotionPrice', '2.20');
    expect(product).toHaveProperty('weekdayPromotion', 'Lunes');
    expect(product).toHaveProperty('openingPromotion', '01:00');
    expect(product).toHaveProperty('closingPromotion', '02:00');
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('PATCH api/v1/promotions', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '2', 3, '123.jpg', 'hola producto 2', 5];

    const sqlPromotion =
      'INSERT INTO promotion (id, id_product, description, promotion_price) VALUES (?, ?, ?, ?)';
    const valuesPromotion = ['50', '2', 'hola promo', 5000];

    const sqlPromotionSchedule =
      'INSERT INTO promotion_schedule (id, id_promotion, weekday_promotion, opening_promotion_hour, closing_promotion_hour) VALUES (?, ?, ?, ?, ?)';
    const valuesPromotionSchedule = ['100', '50', 3, 20, 20];

    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
      await db.query(sqlPromotion, valuesPromotion);
      await db.query(sqlPromotionSchedule, valuesPromotionSchedule);
    } catch (error) {
      throw error;
    }
  });

  it('ERROR /api/v1/promotions - should return 403 without api-key', async () => {
    const res = await request(app).patch('/api/v1/promotions');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/promotions - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .patch('/api/v1/promotions')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('PATCH /api/v1/promotions/:id - should return 200 with promotion ID 1', async () => {
    const promotionData = {
      description: 'DATAEDITADA promotion',
      promotion_price: 10000.1,
    };

    const resPatch = await request(app)
      .patch(`/api/v1/promotions/50`)
      .send({ categoryId: 4, promotionData })
      .set('api-key', '1234');

    expect(resPatch.statusCode).toEqual(200);
    expect(resPatch.body.data).toEqual('50');

    const resGet = await request(app)
      .get(`/api/v1/promotions/50`)
      .set('api-key', '1234');

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.status).toEqual('OK');
    const product = resGet.body.data;
    expect(product).toHaveProperty('description', 'DATAEDITADA promotion');
    expect(product).toHaveProperty('promotionPrice', '10000.10');
  });

  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});

describe('DELETE api/v1/promotions', () => {
  beforeEach(async () => {
    const sqlRestrurant =
      'INSERT INTO restaurant (id, image, name, number, rating) VALUES (?, ?, ?, ?, ?)';
    const valuesRestaurant = ['2', 'jpg.jpg', 'hola', '123', 4];
    const sqlProduct =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct = ['1', '2', 3, '123.jpg', 'hola producto', 4];
    const sqlProduct2 =
      'INSERT INTO product (id, id_restaurant, id_category, image, name, price) VALUES (?, ?, ?, ?, ?, ?)';
    const valuesProduct2 = ['2', '2', 3, '123.jpg', 'hola producto 2', 5];

    const sqlPromotion =
      'INSERT INTO promotion (id, id_product, description, promotion_price) VALUES (?, ?, ?, ?)';
    const valuesPromotion = ['50', '2', 'hola promo', 5000];

    const sqlPromotionSchedule =
      'INSERT INTO promotion_schedule (id, id_promotion, weekday_promotion, opening_promotion_hour, closing_promotion_hour) VALUES (?, ?, ?, ?, ?)';
    const valuesPromotionSchedule = ['100', '50', 3, 20, 20];

    try {
      await db.query(sqlRestrurant, valuesRestaurant);
      await db.query(sqlProduct, valuesProduct);
      await db.query(sqlProduct2, valuesProduct2);
      await db.query(sqlPromotion, valuesPromotion);
      await db.query(sqlPromotionSchedule, valuesPromotionSchedule);
    } catch (error) {
      throw error;
    }
  });
  it('ERROR /api/v1/promotions - should return 403 without api-key', async () => {
    const res = await request(app).delete('/api/v1/promotions');

    expect(res.statusCode).toEqual(403);
  });

  it('ERROR /api/v1/promotions - should return 401 with wrong apikey', async () => {
    const res = await request(app)
      .delete('/api/v1/promotions')
      .set('api-key', '123456');

    expect(res.statusCode).toEqual(401);
  });

  it('DELETE /api/v1/promotions/:id - should delete the promotion from lastRestaurant', async () => {
    const resDelete = await request(app)
      .delete(`/api/v1/promotions/50`)
      .set('api-key', '1234');

    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.data).toEqual('50');
  });
  afterEach(async () => {
    const sql = 'DELETE FROM restaurant WHERE id = ?';
    const values = ['2'];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw error;
    }
  });
});
