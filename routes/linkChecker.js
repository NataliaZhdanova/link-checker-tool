import express from "express";
import cors from "cors";
import {scrapeRecursively} from '../utils/scraper.js';

// This creates a new router object. 
// Routers in Express allow you to group route handlers for a particular part of your site together and access them using a common route-prefix.
const router = express.Router();

// This adds middleware to enable CORS (Cross-Origin Resource Sharing) for all routes in this router.
router.use(cors());

// This sets up a route handler for POST requests to the '/check' endpoint.
// When a POST request is made to this endpoint, the callback function is executed.
router.post('/check', async (req, res) => {
    
    // This uses destructuring to extract the 'url' property from the request body.
    // It assumes that the incoming request has a JSON body with a 'url' field.
    const { url, maxDepth = 2 } = req.body;

    // This checks if the 'url' is missing. If true, it sends a 400 (Bad Request) status code with an error message in JSON format.
    // The return statement ensures that the rest of the function doesn't execute if there's no URL.
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    try {
      const results = await scrapeRecursively(url, maxDepth);
      res.json(results);
    } catch (error) {
      console.error(`Error checking links: ${error.message}`);
      res.status(500).json({ error: 'An error occurred while checking links' });
    }
  });



export default router;