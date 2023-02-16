import User from '../model/User.js';
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    if (!users) return res.status(204).json({ message: "No users found" });
    res.json(users);
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const addUser = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.activationKey = Date.now() + 9999999;

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: newUser.email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    //encrypt the password
    const salt = await bcrypt.genSalt();

    const encryptedPwd = await bcrypt.hash(newUser.password, salt);

    //create and store the new email
    const result = await User.create({
        "firstName":newUser.firstName,
        "lastName":newUser.lastName,
        "email": newUser.email,
        "password": encryptedPwd,
        "activationKey":newUser.activationKey,
        "isActivated":newUser.isActivated,
        "roles": newUser.roles
    });

    // console.log(result);

    res.status(201).json({message: `New email ${newUser.email} created!`});
  } catch (error) {
    res.status(500).send("Error " + error);
  }
};

const updateUser = async (req, res) => {
    try {
      const currentUser = req.body;


      if (!currentUser._id) {
          return res.status(400).json({ 'message': 'ID parameter is required.' });
      }
  
      const user = await User.findOne({ _id: currentUser._id }).exec();
      if (!user) {
          return res.status(204).json({ "message": `No user matches ID ${currentUser._id}.` });
      }

      if (currentUser.firstName) user.firstName = currentUser.firstName;
      if (currentUser.lastName) user.lastName = currentUser.lastName;

      if (currentUser.email) user.email = currentUser.email;
      if (currentUser.activationKey) user.activationKey = currentUser.activationKey;
      if (currentUser.roles) user.roles = currentUser.roles;
      
      user.isActivated = currentUser.isActivated;
  
      const result = await user.save();
  
      res.json(result);
    } catch (error) {
      res.status(500).send("Error " + error);
    }
  };

const deleteUser = async (req, res) => {
    try {
        const currentUserId = req?.params?.id;

        if (!currentUserId) return res.status(400).json({ "message": 'User ID required' });
    
        const user = await User.findOne({ _id: currentUserId }).exec();
    
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${currentUserId} not found` });
        }
    
        const result = await user.deleteOne({ _id: currentUserId });
        res.json(result);
        
    } catch (error) {
        res.status(500).send("Error " + error);
    }   
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

export default {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser
}