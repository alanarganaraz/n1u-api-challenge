const express = require('express');
// const apicache = require("apicache");
const v1RestaurantsRouter = require('../src/routes/v1/restaurantRoutes');
const v1ProductsRouter = require('../src/routes/v1/productRoutes')
const v1PromotionsRouter = require('../src/routes/v1/promotionRoutes')
const { tokenVerification } = require('../src/middleware/index')
// const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");

const app = express();
const PORT = process.env.PORT || 3000;
// const cache = apicache.middleware;

app.use(express.json());
  
// app.use(cache("2 minutes"));
app.use('/api/v1/restaurants', tokenVerification, v1RestaurantsRouter);
app.use('/api/v1/products', tokenVerification, v1ProductsRouter);
app.use('/api/v1/promotions', tokenVerification, v1PromotionsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  // V1SwaggerDocs(app, PORT);
});
