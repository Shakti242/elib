/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

/**
 * Controller to create a new user.
 */
const createUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = req.body; // Expecting an array of user objects

  // Validation: Check if the body contains an array and if it’s not empty
  if (!Array.isArray(users) || users.length === 0) {
    return next(createHttpError(400, "At least one user is required"));
  }

  try {
    const createdUsers = [];

    // Loop over the users array and create each user
    for (const user of users) {
      const { name, email, password } = user;

      // Validate individual user fields
      if (!name || !email || !password) {
        return next(createHttpError(400, "All fields (name, email, password) are required"));
      }

      // Check if email format is valid using regex
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return next(createHttpError(400, "Invalid email format"));
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return next(createHttpError(400, `User already exists with email: ${email}`));
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      createdUsers.push(newUser);
    }

    // Respond with the created users
    res.status(201).json({ users: createdUsers });
  } catch (err) {
    console.error("Error while creating users:", err);
    return next(createHttpError(500, "Error while creating users"));
  }
};

/**
 * Controller to login a user.
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return next(createHttpError(400, "Invalid email format"));
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    // Generate JWT token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d", // Token expiry of 7 days
      algorithm: "HS256", // JWT algorithm
    });

    // Return the token to the client
    res.status(200).json({ accessToken: token });

  } catch (error) {
    console.error("Error during login:", error);
    return next(createHttpError(500, "Error during login"));
  }
};

export { createUsers, loginUser };
