import mongoose, { Document, Model } from 'mongoose';

// Define the User interface extending Mongoose's Document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Define the schema
const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Define and export the model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
