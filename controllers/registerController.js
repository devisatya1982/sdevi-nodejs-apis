import User from '../model/User.js';
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";

const handleNewUser = async (req, res) => {
    const newUser = req.body;

    const { email, password } = newUser;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const salt = await bcrypt.genSalt();
        const encryptedPwd = await bcrypt.hash(password, salt);
        // newUser._id = Date.now();
        newUser.activationKey = Date.now();

        //create and store the new email
        const result = await User.create({
            "firstName":newUser.firstName,
            "lastName":newUser.lastName,
            "email": newUser.email,
            "password": encryptedPwd,
            "activationKey":newUser.activationKey,
            "isActivated":false,
            "roles":1000,
        });

        console.log(result);

        await emailSender(result, res, "signup");

        res.status(201).json({ 'message': `New user ${email} created! & please activate with the activation key sent to your email` });
    } catch (error) {
        res.status(500).json({ 'message': error });
    }
}

export { handleNewUser };


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
          ? `Your Activation Key : ${userData.activationKey}`
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