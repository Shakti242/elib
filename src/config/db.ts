import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        mongoose.connect(config.databaseUrl as string);
        mongoose.connection.on('connected', () => {
            console.log("Connected to database");
        });
        mongoose.connection.on('error', () => {
            console.log("Connection error");
        });
    } catch (err) {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    }
};
export default connectDB;