import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
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