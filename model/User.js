import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    activationKey: {
        type: Number,
        required: true
    },
    isActivated: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        required: true
    },
   
    refreshToken: [String]
});

export default mongoose.model('User', userSchema);