const v1RestaurantsRouter = require('../src/routes/v1/restaurantRoutes');
const v1ProductsRouter = require('../src/routes/v1/productRoutes')
const v1PromotionsRouter = require('../src/routes/v1/promotionRoutes')
const { tokenVerification } = require('../src/middleware/index')

// const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
  
app.use('/api/v1/restaurants', tokenVerification, v1RestaurantsRouter);
app.use('/api/v1/products', tokenVerification, v1ProductsRouter);
app.use('/api/v1/promotions', tokenVerification, v1PromotionsRouter);

app.listen(PORT, () => {
  // V1SwaggerDocs(app, PORT);
});

module.exports = app
