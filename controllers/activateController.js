import User from "../model/User.js";
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";

const handleActivate = async (req, res) => {
  try {
    const activationKey = req.body.activationKey;

    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      if (foundUser.activationKey !== Number(activationKey)) {
        res.status(401).json({ message: "ActivationKey is Invalid" });
      }

      if (foundUser.isActivated) {
        res
          .status(200)
          .json({
            message: "User Already Activated!, Redirecting to Login Page",
          });
      }

      foundUser.isActivated = true;
      const result = await foundUser.save();

      if (result) {
        res
          .status(200)
          .json({ message: "User Activated!, Redirecting to Login Page" });
      }
    } else {
      res.status(404).json({ message: "Invalid Password" }); // 404 Not Found
    }
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

export { handleActivate };
