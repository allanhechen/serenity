const { expressjwt } = require("express-jwt");

const secret = "your_secret_key";

const auth = expressjwt({
  secret: secret,
  algorithms: ["HS256"],
});

export default auth;
