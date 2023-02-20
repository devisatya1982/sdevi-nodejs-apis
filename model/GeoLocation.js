import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const geoLocation = new Schema({
    address: {
        type: String,
        required: true
    },
    timeStamp: {
        type: String,
        required: true
    },
});

export default mongoose.model('UsersGeoLocation', geoLocation);