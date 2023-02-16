import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleNgLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) return res.status(401).json({ message: "User not found." });

    if (!foundUser.isActivated)
      return res.status(401).json({ message: "User must be activated." });

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" }
      );
       
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

export { handleNgLogin };
