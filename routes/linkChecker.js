import express from "express";
import cors from "cors";

// This creates a new router object. 
// Routers in Express allow you to group route handlers for a particular part of your site together and access them using a common route-prefix.
const router = express.Router();

// This adds middleware to enable CORS (Cross-Origin Resource Sharing) for all routes in this router.
app.use(cors());

// This sets up a route handler for POST requests to the '/check' endpoint.
// When a POST request is made to this endpoint, the callback function is executed.
router.post('/check', (req, res) => {
    // This uses destructuring to extract the 'url' property from the request body.
    // It assumes that the incoming request has a JSON body with a 'url' field.
    const { url } = req.body;

    // This checks if the 'url' is missing. If true, it sends a 400 (Bad Request) status code with an error message in JSON format.
    // The return statement ensures that the rest of the function doesn't execute if there's no URL.
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    // TODO: Implement link checking logic

    // If an URL is provided, this sends a JSON response with a message indicating that links are being checked for the given URL.
    res.json({ message: `Checking links for ${url}` });
  });

export default router;