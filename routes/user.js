const route = require('express').Router();

route.get('/', (req, res) => {
  res.send('This is working');
});
module.exports = route;