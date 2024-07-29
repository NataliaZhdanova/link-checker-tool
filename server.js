// Dotenv configuration
import dotenv from 'dotenv';
// Load environment variables from a .env file into process.env (and access them as process.env.VARIABLE_NAME)
dotenv.config();

// Import the express module
import express from "express";

// Routing
import router from './routes/linkChecker.js';

// Helmet helps you secure your Express apps by setting various HTTP headers.
import helmet from 'helmet';

// Compression compresses the response bodies for all requests making the app faster.
import compression from 'compression';

// Create an instance of an Express application and assign it to the variable
const app = express();

// Set the port number for the server. It tries to use the port specified in the environment variable PORT, or defaults to 3000 if no environment variable is set.
const PORT = process.env.PORT || 3000;

// Disable the 'x-powered-by' header in the response to prevent information exposure about the server.
app.disable('x-powered-by')

// Add middleware to set various HTTP headers to secure the application.
app.use(helmet());

// Add compression middleware to compress the response bodies for all requests that traverse through the middleware.
app.use(compression());

// Add middleware to parse JSON bodies of incoming requests. It allows the server to handle JSON data sent in the request body.
app.use(express.json());

// Set up a route handler for GET requests to the root path ('/'). 
// When a GET request is made to '/', the callback function is executed, and this sends a response to the client with the text "Link Checker API is running".
app.get('/', (req, res) => {
    res.send('Link Checker API is running');
});

// Start the server and make it listen for incoming requests on the specified PORT.
// The callback function is executed once the server starts listening.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Mount routes under the '/api' path.
app.use('/api', router);

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send("Sorry, there is no such page!");
  })

// When app.use() is called with four arguments, Express recognizes it as error-handling middleware.
app.use((err, req, res, next) => {
    // This logs the error stack trace to the console. It's useful for debugging and seeing detailed error information server-side.
    console.error(err.stack);
    // Set the HTTP status code of the response to 500 (Internal Server Error). 
    // Send the specified text as the response body to the client.
    res.status(500).send('Something is not working, sorry!');
  });