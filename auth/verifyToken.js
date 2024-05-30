import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, "JESON_WEB_TOKEN");
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default verifyToken;
