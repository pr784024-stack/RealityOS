const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
