import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files of the entire client dist folder
app.use(express.static('../client/dist'));  // Adjust path if necessary

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());  // Parses JSON data
app.use(express.urlencoded({ extended: true }));  // Parses URL-encoded form data

// Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
