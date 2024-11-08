import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB,
  env: process.env.NODEENV,
  jwtSecret: process.env.JWT_SECRET,

};

export const config = Object.freeze(_config);