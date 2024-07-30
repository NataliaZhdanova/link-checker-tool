// Fetch the HTML content of a webpage using axios
import axios from "axios";
// Get dynamic links using puppeteer
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

async function scrapeConsequently(url) {

  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    args: ['--disable-features=site-per-process'],
  });
  console.log('Browser launched');
  const page = await browser.newPage();
  console.log('New page created');

  try {
    // Step 1: Use the initial link to open the webpage in the browser  
    await page.goto(url, { waitUntil: 'networkidle0' });

    console.log('Page loaded');

    // Step 2: Get menu links with the function getMenuLinks
    const menuLinks = await getMenuLinks(page);
    console.log('menuLinks collected');

    // Step 3: Get page links for each menu link
    const result = {};
    for (const menuLink of menuLinks) {
      result[menuLink] = await getPageLinks(browser, menuLink);
    }

    // Step 4: Return the result object
    console.log(result);
    return result;

  } finally {
    await browser.close();
  }
}

async function getMenuLinks(page) {
  
  // Wait for the selector to load
  await page.waitForSelector('li.tree-node');
  
  // Get the menu items
  const menuLinks = await page.evaluate(() => {
    
    // Find anchors in all the menu items
    const anchors = Array.from(document.querySelectorAll('li.tree-node > a'));
    
    // Return an array of the menu anchors
    return anchors.map(anchor => anchor.href);
  });

  // Leave only unique links
  let docPages = new Set();
  for (const link of menuLinks) {
    docPages.add(link);
  }
  
  // Strip the links from unnecessary parts
  const trimmedUrlsSet = new Set();
  for (const element of docPages) {
    
    // Find the position of '.htm' in the URL
    const position = element.indexOf('.htm');
    
    // Extract the part of the URL up to and including '.htm'
    const trimmedUrl = element.substring(0, position + 4);
    trimmedUrlsSet.add(trimmedUrl);
  }
  return trimmedUrlsSet;
}

async function getPageLinks(browser, url) {
  const page = await browser.newPage();
  try {
    // Open the webpage in the browser
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract links from the page
    await page.waitForSelector('[id="mc-main-content"]');

    // Get the links
    const pageLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors.map(anchor => anchor.href);
    });

    // Leave only unique links
    const pageLinksUnique = new Set();
    for (const link of pageLinks) {
      pageLinksUnique.add(link);
    }
    return pageLinksUnique;
  } finally {
    await page.close();

  }
}

// async function scrapeRecursively(url, maxDepth = 2, currentDepth = 0, visited = new Set()) {
//   if (currentDepth > maxDepth || visited.has(url)) {
//     return [];
//   }

//   visited.add(url);
//   const html = await fetchPage(url);
//   if (!html) return [];

//   const links = extractLinks(html, url);
//   const checkedLinks = await checkLinks(links);

//   const results = [{ pageUrl: url, links: checkedLinks }];

//   for (const link of links) {
//     if (link.url.startsWith(url)) { // Only follow links within the same domain
//       const childResults = await scrapeRecursively(link.url, maxDepth, currentDepth + 1, visited);
//       results.push(...childResults);
//     }
//   }

//   return results;
// }



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


  

// export { fetchPage, extractLinks, checkLinks, scrapeRecursively };
export { checkLinks, scrapeConsequently };