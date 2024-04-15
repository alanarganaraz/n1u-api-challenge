const jwt = require('jsonwebtoken');
// el APIKEY deberia estar guardado como una secret en un servidor pero al no tenerlo, lo dejamos en este json
// simulando que es la secret.
const { apiKey } = require('../config/enviroment-test.json')

const generateToken = () => {
  const payload = {
    createdAt: Date.now(),
  };

  const options = {
    expiresIn: '5m',
  };

  const token = jwt.sign(payload, apiKey, options);
  return token;
};

const tokenVerification = (req, res, next) => {
  const apiKey = req.headers['api-key'];

  try {
    if (!apiKey) {
      throw { status: 403, message: 'Forbidden' };
    }
    const newToken = generateToken();

    jwt.verify(newToken, apiKey, (err, decoded) => {
      if (err) {
        throw { status: 401, message: 'Unauthorized' };
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(error.status).json({ error });
  }
};

module.exports = {
  tokenVerification,
};
