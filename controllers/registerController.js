import User from '../model/User.js';
import bcrypt from "bcrypt";

const handleNewUser = async (req, res) => {
    const newUser = req.body;

    const { email, password } = newUser;
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const salt = await bcrypt.genSalt();
        const encryptedPwd = await bcrypt.hash(password, salt);
        newUser._id = Date.now();
        newUser.activationKey = Date.now() * 5;

        //create and store the new email
        const result = await User.create({
            "_id":Date.now(),
            "firstName":newUser.firstName,
            "lastName":newUser.lastName,
            "email": newUser.email,
            "password": encryptedPwd,
            "activationKey":newUser.activationKey,
            "isActivated":false,
            "roles": 'user'
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${email} created! & please activate with the activation key sent to your email` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

export { handleNewUser };