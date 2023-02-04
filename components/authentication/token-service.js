import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const secretOrPrivateKey = process.env.ACCESS_TOKEN_SECRET;
  const unAuthorizedRequest = "Unauthorized request";
 
  if (!req.headers.authorization) {
    return res.status(401).send(unAuthorizedRequest);
  }
  let token = req.headers.authorization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send(unAuthorizedRequest);
  }
  // let payload = jwt.sign({ myToken: token }, secretOrPrivateKey);

  // let checkForNull = jwt.decode(token);
  // Above line do the same like below logic
  jwt.verify(token, secretOrPrivateKey,   (error, user)=> {
    if (error) return res.sendStatus(403);
    

    try {
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
    }
  });
};



export default verifyToken;
