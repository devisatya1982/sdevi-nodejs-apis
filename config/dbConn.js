import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const connectionString = process.env.DATABASE_URI;
        await connect(connectionString, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

export default connectDB