const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secretKey = process.env.SECRET;

const requireAuth = async (req, res, next) => {
  //verify token
  const token = req.headers.authorization;

  const cleanedToken = (token || "").replace(/^"(.*)"$/, "$1");

  const splitToken = cleanedToken.split(" ");
  const mainToken = splitToken[1];

  if (!mainToken) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    jwt.verify(mainToken, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: "Invalid token" });
      }

      const userId = new mongoose.Types.ObjectId(decoded._id);
      req.userId = userId; // Add userId to request for use in other route handlers
      next();
    });
  } catch (error) {
    return res.send({ error: "request not authorized" });
  }
};

module.exports = requireAuth;
