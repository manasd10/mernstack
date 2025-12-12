const { validationResult } = require('express-validator');

module.exports = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return first error for simplicity
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
