import { config as conf } from 'dotenv';

// Load environment variables from .env file
conf();

const _config = {
  port: process.env.PORT || '3000',  // Default port if not provided
  databaseUrl: process.env.MONGO_CONNECTION_STRING || '',  // Correct key for MongoDB URL
};

export const config = Object.freeze(_config);
