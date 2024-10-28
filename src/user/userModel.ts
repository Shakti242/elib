import mongoose from 'mongoose'
import { User } from './userTypes';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);
//users
export default mongoose.model<User>('User', userSchema);