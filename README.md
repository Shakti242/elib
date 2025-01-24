# elib - Book Management API

This is an API for managing books and users, built with Node.js and TypeScript. It supports CRUD operations for books and users, includes authentication, file uploads, and integrates with Cloudinary for media storage.

## Features

- **Manage Books**: Add, update, delete, and retrieve book details.
- **User Management**: Register, authenticate, and manage users.
- **File Uploads**: Upload files with Cloudinary integration.
- **Dockerized**: Easy deployment with Docker.

## Project Structure

📂 src  
┣ 📂 book  
┃ ┣ 📜 bookController.ts  
┃ ┣ 📜 bookModel.ts  
┃ ┣ 📜 bookRouter.ts  
┃ ┗ 📜 bookTypes.ts  
┣ 📂 user  
┃ ┣ 📜 userController.ts  
┃ ┣ 📜 userModel.ts  
┃ ┣ 📜 userRouter.ts  
┃ ┗ 📜 userTypes.ts  
┣ 📂 config  
┃ ┣ 📜 cloudinary.ts  
┃ ┣ 📜 config.ts  
┃ ┗ 📜 db.ts  
┣ 📂 middlewares  
┣ 📜 app.ts  
┣ 📜 Dockerfile  
┣ 📜 docker-compose.yaml  
┗ 📜 ecosystem.config.js  

## Prerequisites

- **Node.js**: v16 or higher
- **Docker**: v20 or higher
- **Cloudinary Account**: To store and retrieve uploaded media files

## Installation

### 1. Clone the Repository

`git clone https://github.com/your-username/elib.git`

### 2. Install Dependencies

`npm install`

### 3. Set up Environment Variables

-**Create a `.env` file in the root directory and configure the following variables:

**CLOUDINARY_URL=<your-cloudinary-url> 
**DATABASE_URL=<your-database-url> 
**JWT_SECRET=<your-jwt-secret> 
**PORT=3000


## Running Locally

To start the development server:

`npm run dev`

## Running with Docker

To build and run the application using Docker Compose:

`docker-compose up`

## API Endpoints

### Books
- `GET /books` - Fetch all books
- `POST /books` - Add a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

### Users
- `POST /users/register` - Register a new user
- `POST /users/login` - Authenticate a user

### File Uploads
- `POST /upload` - Upload files to Cloudinary
