import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    employeeSal: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Employee', employeeSchema);