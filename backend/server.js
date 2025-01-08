// Import required modules
const app = require("./app"); // Import the Express app instance
const connectDatabase = require("./config/database"); // Import the database connection module
const express = require("express");




// Connect to Database
/**
 * Establish a connection to the database using the connectDatabase module.
 */
connectDatabase();

// Set Port Number
/**
 * Set the port number for the server to listen on.
 * Use the PORT environment variable or default to 5000.
 */
const port = process.env.PORT || 5000;

// Start Server
/**
 * Start the server and listen on the specified port.
 */
let server;
server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle Uncaught Exceptions
/**
 * Catch and handle uncaught exceptions to prevent server crashes.
 * Log the error message and shut down the server.
 */
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to Uncaught Exception");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Handle Unhandled Promise Rejections
/**
 * Catch and handle unhandled promise rejections to prevent server crashes.
 * Log the error message and shut down the server.
 */
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to Unhandled Promise Rejection");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});