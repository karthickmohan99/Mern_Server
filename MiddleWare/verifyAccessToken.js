import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.cookies["access-token"];
  console.log(token, "----token-----");
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  const isValid = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized! Access Token was expired!" });
      }

      
      req.user = decoded;
      next();
    }
  );
};

export default verifyAccessToken;
