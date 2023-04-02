import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleLogin = async (req, res) => {
  try {
    const cookies = req.cookies;

    const testEnv = process.env.NODE_ENV?.toLocaleLowerCase().trim();
    

    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) return res.sendStatus(401); 

    if (!foundUser.isActivated)
      return res.status(401).json({ message: "User must be activated." });

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rtoken) => rtoken !== cookies.jwt);

      if (cookies?.jwt) {
        /* 
                Scenario added here: 
                    1) User logs in but never uses RT(Refresh Token) and does not logout 
                    2) RT is stolen
                    3) If 1 & 2, reuse detection is needed to clear all RTs when email logs in
                */
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: process.env.NODE_ENV === "production" ? true : false,
        });
      }

      // Saving refreshToken with current email
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

     // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // secure: true only serves on https
      // Send authorization roles and access token to email

      const currentStatus = {
        accessToken: accessToken,
        message: "Tokens generated successfully!",
        status: true,
        user: {
          email: foundUser.email,
          name: foundUser.firstName + " " + foundUser.lastName,
          roles: foundUser.roles,
        },
      };

      res.status(200).send(currentStatus);

    } else {
      res.status(404).json({ message: "Invalid Password" });
    }
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

export { handleLogin };
