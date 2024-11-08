import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        console.log("hello................................................................")
        console.log(process.env.NODEENV);

        // Wait for the connection
        await mongoose.connect(config.databaseUrl as string);
        console.log("Connected to database successfully");

        // Setup error handling after successful connection
        mongoose.connection.on('error', (err) => {
        });

        mongoose.connection.on('disconnected', () => {
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

    } catch (err) {
        console.error("Failed to connect to the database:", err);
        process.exit(1);
    }
};

export default connectDB;