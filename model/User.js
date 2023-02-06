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
    activatedKey: {
        type: Number,
        required: true
    },
    isActivated: {
        type: Boolean,
        required: false
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
   
    refreshToken: [String]
});

export default mongoose.model('User', userSchema);