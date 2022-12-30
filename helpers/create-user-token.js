const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    // payload data
    {
      name: user.name,
      id: user.id,
    },
    "s4ssecret"
  );

  // return token
  res.status(200).json({
    message: "You are authenticated!",
    token: token,
    userId: user.id,
  });
};

module.exports = createUserToken;
