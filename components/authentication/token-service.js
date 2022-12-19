import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const secretOrPrivateKey = "secretKey";
  const unAuthorizedRequest = "Unauthorized request";
  const jsonWebTokenError = "invalid token";

  if (!req.headers.authorization) {
    return res.status(401).send(unAuthorizedRequest);
  }
  let token = req.headers.authorization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send(unAuthorizedRequest);
  }
  let payload = jwt.sign({ myToken: token }, secretOrPrivateKey);

  // let checkForNull = jwt.decode(token);
  // Above line do the same like below logic
  jwt.verify(token, secretOrPrivateKey, function (errDecoded, decoded) {
    if (errDecoded) {
      return res.status(401).send(jsonWebTokenError);
    }

    try {
      req.userId = payload.subject;
      next();
    } catch (err) {
      console.log(err);
    }
  });
};

export default verifyToken;
