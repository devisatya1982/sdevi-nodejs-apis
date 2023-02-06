import User from '../model/User.js';
import bcrypt from "bcrypt";

const handleNewUser = async (req, res) => {
    const userData = req.body;

    const { email, password } = userData;
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const salt = await bcrypt.genSalt();
        const encryptedPwd = await bcrypt.hash(password, salt);
        userData._id = Date.now();
        userData.activationKey = Date.now() * 5;
        userData.isActivated = false;

        //create and store the new email
        const result = await User.create({
            "_id":Date.now(),
            "firstName":userData.firstName,
            "lastName":userData.lastName,
            "email": userData.email,
            "password": encryptedPwd,
            "activationKey":userData.activationKey,
            "isActivated":false
        });

        console.log(result);

        res.status(201).json({ 'success': `New email ${email} created! & please activate with the activation key sent to your email` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

export { handleNewUser };