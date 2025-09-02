const JWT = require("jsonwebtoken");

const secret = "superMan123";//isko secret rakho

function createTokenForUser(user) {//user object lega and token generate krdega
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {//to validate payload
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
