import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { MongoClient } from "mongodb";
import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";

import bcrypt from "bcrypt";

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DATABASE = "satyas";
const COLLECTION_USER = "user";
const COLLECTION_TOKENS = "tokens";

router.get("/", async (req, res) => {
  try {
    res.send("Authentication route default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(COLLECTION_USER);

    const userData = req.body;
    userData._id = Date.now();
    userData.key = Date.now();
    userData.isActivated = false;
    userData.role = "user";

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);
    if (foundUserData) {
      let currentStatus = {
        message: `Email : ${userData.email} already exists`,
        status: false,
      };
      res.status(401).send(currentStatus);
    } else {
      //#region Encrypt Password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
      //#endregion

      const insertedOneUser = await currentCollection.insertOne(userData);
      await emailSender(userData, res, "signup");

      if (insertedOneUser.acknowledged && insertedOneUser.insertedId > 0) {
       const currentStatus = {
          message: `Please Activate Your Account With the Key Sent to your registered email : ${userData.email}`,
          status: true,
        };
        res.status(200).send(currentStatus);
      } else {
        const currentStatus = {
          message: "User Not Registered Properly!",
          status: false,
        };
        res.status(404).send(currentStatus);
      }
    }
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

let refreshTokens = [];

router.post("/token", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const currentDatabase = client.db(DATABASE);
    const currentCollectionTokens = currentDatabase.collection(COLLECTION_TOKENS);

    const query = { email: req.body.email };
    const foundUserData = await currentCollectionTokens.findOne(query);

    if (foundUserData === null) {
      const currentStatus = {
        message: "No Data found with your account!",
        status: false,
      };
      return res.status(404).send(currentStatus);
    }
    if (!foundUserData.refreshToken) {
      const currentStatus = {
        message: "No Refresh Token found with your account!",
        status: false,
      };
      return res.status(404).send(currentStatus);
    }

    const refreshToken = foundUserData.refreshToken;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        const currentStatus = {
          message: "Refresh Token Invalid!",
          status: false,
        };
        return res.status(403).send(currentStatus);
      }

      const accessToken = generateAccessToken({ name: user.name });

      const currentStatus = {
        accessToken: accessToken,
        message: "Access Token has been generated successfully!",
        status: true,
      };
      res.status(200).send(currentStatus);
    });
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

router.delete("/logout", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const currentDatabase = client.db(DATABASE);
    const currentCollectionTokens = currentDatabase.collection(COLLECTION_TOKENS);
    const query = { email: req.body.email };
    const result = await currentCollectionTokens.deleteMany(query);

    if (result.acknowledged && result.deletedCount > 0) {
      const currentStatus = {
        message: "Logged out || Refresh Token has been removed successfully!",
        status: true,
      };
      res.status(200).send(currentStatus);
    } else {
      const currentStatus = {
        message: "Not Properly Logged out!",
        status: false,
      };
      res.status(404).send(currentStatus);
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(COLLECTION_USER);

    const currentCollectionTokens =
      currentDatabase.collection(COLLECTION_TOKENS);

    const userData = req.body;

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);

    let currentStatus = {
      accessToken: "",
      message: "",
      status: false,
      user: {
        email: "",
        name: "",
        role: "",
      },
    };

    if (!foundUserData) {
      currentStatus = {
        message: "Invalid Email",
        status: false,
      };
      res.status(401).send(currentStatus);
    }

    if (!foundUserData.isActivated) {
      currentStatus = {
        message: "User Must Be Activated",
        status: false,
      };

      res.status(401).send(currentStatus);
    }

    if (await bcrypt.compare(userData.password, foundUserData.password)) {
      let user = { email: foundUserData.email };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshAccessToken(user);

      const refreshTokenData = {
        email: foundUserData.email,
        refreshToken: refreshToken,
      };

      await currentCollectionTokens.insertOne(refreshTokenData);

      currentStatus = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Tokens generated successfully!",
        status: true,
        user: {
          email: foundUserData.email,
          name: foundUserData.firstName + " " + foundUserData.lastName,
          role: foundUserData.role,
        },
      };

      res.status(200).send(currentStatus);
    } else {
      currentStatus = {
        message: "Invalid Password",
        status: false,
      };
      res.status(401).send(currentStatus);
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

router.post("/activate", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(COLLECTION_USER);
    const userData = req.body;
    const activatedKey = req.body.key;

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);

    if (!foundUserData) {
      const currentStatus = {
        message: "Invalid Email",
        status: false,
      };
      res.status(401).send(currentStatus);
    }

    if (await bcrypt.compare(userData.password, foundUserData.password)) {
      if (foundUserData.key !== Number(activatedKey)) {
        const currentStatus = {
          message: "Key is Invalid",
          status: false,
        };
        res.status(401).send(currentStatus);
      }

      if (foundUserData.isActivated) {
        const currentStatus = {
          message: "User Already Activated!, Redirecting to Login Page",
          status: true,
        };

        res.status(200).send(currentStatus);
      }

      foundUserData.isActivated = true;
      const updatedOneResult = await currentCollection.updateOne(
        { _id: foundUserData._id },
        { $set: foundUserData }
      );

      if (updatedOneResult.acknowledged && updatedOneResult.modifiedCount > 0) {
        const currentStatus = {
          message: "User Activated, Redirecting to Login Page",
          status: true,
        };

        res.status(200).send(currentStatus);
      } else {
        const currentStatus = {
          message: "User Not Activated!",
          status: false,
        };

        res.status(200).send(currentStatus);
      }
    } else {
      const currentStatus = {
        message: "Invalid Password",
        status: false,
      };
      res.status(401).send(currentStatus);
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

router.post("/forgotpwd", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(COLLECTION_USER);
    const userData = req.body;

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);

    if (!foundUserData) {
      const currentStatus = {
        message: `Email : ${userData.email} not found`,
        status: true,
      };

      res.status(401).send(currentStatus);
    } else {
      await emailSender(foundUserData, res, "forgotpwd");

      const currentStatus = {
        message: `Your password has been sent to your registered email : ${foundUserData?.email}`,
        status: true,
      };

      res.status(200).send(currentStatus);
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

export default router;
async function emailSender(userData, res, typeOfEmail) {
  let transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: "devisatya1982@gmail.com",
      pass: "mkdeavmkjgclgrya",
    },
  });

  let mailOptions = {
    from: "devisatya1982@gmail.com",
    to: userData.email,
    subject:
      typeOfEmail === "signup"
        ? " SATYANARAYANA DEVI !! Activation Key  !!"
        : "SATYANARAYANA DEVI !! Your Password !!",
    text:
      typeOfEmail === "signup"
        ? `Your Activation Key : ${userData.key}`
        : ` Your Password is : ${userData.password}`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(200).send(`Error has been generated! ==> ${error}`);
    } else {
      res.status(200).send(`New Email has been sent! ==> ${info.response}`);
    }
  });
}

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "45s" }); // 10m
};

const generateRefreshAccessToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};
