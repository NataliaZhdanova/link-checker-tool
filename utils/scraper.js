// Fetch the HTML content of a webpage using axios
import axios from "axios";
// Parse the HTML content using cheerio
import cheerio from "cheerio";

async function fetchPage(url) {
	try {
        // Fetch the HTML content of the webpage
	    const response = await axios.get(url);
	        return response.data;
	    } catch (error) {
	        console.error(`Error fetching ${url}: ${error.message}`);
	            return null;
	        } 
}

function extractLinks(html, baseUrl) {
	// Load the HTML content using cheerio
    const $ = cheerio.load(html);
	// Create an empty array to store the links
    const links = [];
	// Find all anchor tags in the HTML content
    $('a').each((i, element) => {
	    // Extract the href attribute of the anchor tag
        const href = $(element).attr('href');
	        if (href) {
                // Create an absolute URL by combining the href attribute with the base URL
	            const absoluteUrl = new URL(href, baseUrl).href;
                // Check if the anchor tag opens in a new tab
	            const opensInNewTab = $(element).attr('target') === '_blank';
                // Add the absolute URL and the opensInNewTab flag to the links array
	            links.push({ url: absoluteUrl, opensInNewTab });
	        }  
	});   
	return links; 
} 

async function checkLink(url) {
	try {
        // Send a HEAD request to the URL to check if it's reachable
	    const response = await axios.head(url, { timeout: 5000 });
	    return { status: response.status, working: true };
    } catch (error) {
        if (error.response) {
              return { status: error.response.status, working: false };
        } else {
              return { status: 0, working: false, error: error.message };
        }
	}
} 

async function checkLinks(links) {
	// Use Promise.all to concurrently check all links
    const results = await Promise.all(links.map(async (link) => {
	    // Check the status of each link
        const checkResult = await checkLink(link.url);
	    return { ...link, ...checkResult, };
    }));  
    return results; 
}

async function scrapeRecursively(url, maxDepth = 2, currentDepth = 0, visited = new Set()) {
    if (currentDepth > maxDepth || visited.has(url)) {
      return [];
    }
  
    visited.add(url);
    const html = await fetchPage(url);
    if (!html) return [];
  
    const links = extractLinks(html, url);
    const checkedLinks = await checkLinks(links);
  
    const results = [{ pageUrl: url, links: checkedLinks }];
  
    for (const link of links) {
      if (link.url.startsWith(url)) { // Only follow links within the same domain
        const childResults = await scrapeRecursively(link.url, maxDepth, currentDepth + 1, visited);
        results.push(...childResults);
      }
    }
  
    return results;
  }
  

export { fetchPage, extractLinks, checkLinks, scrapeRecursively };