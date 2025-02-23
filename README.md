# VWO Scraper

This project is a web scraper that extracts information from ecommerce stores using VWO (Visual Website Optimizer) and stores the data in a MongoDB database.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/javida1492/vwo-scraper.git
   ```
2. Navigate to the project directory:
   ```sh
   cd vwo-scraper
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Update the `urlList` array in `index.js` with the URLs of the ecommerce stores you want to scrape.
2. Ensure MongoDB is running and update the `mongoUrl` and `dbName` variables in `index.js` if necessary.

## Usage

Run the scraper:

```sh
node index.js
```

## Project Structure

`index.js`: Main entry point of the scraper.

- Launches the Puppeteer browser.
- Connects to MongoDB.
- Iterates over the list of URLs to scrape and inserts the structured results into the database.

`src/extractVwoInfo.js`

- Primary module for extracting VWO information from a given URL.
- Opens a new page using Puppeteer.
- Sets up network event listeners (using setupPageHandlers.js) to capture VWO-related requests and responses.
  = Extracts VWO identifiers and detailed test info.
- Structures the output using the structureResult.js helper.

`src/setupPageHandlers.js`

- Sets up Puppeteer page event listeners to capture VWO-related network requests and JSON responses.
- Captures network requests that include the term "vwo".
- Collects JSON responses that are related to VWO.

`src/extractIdentifiers.js`

- Contains a helper function that extracts potential VWO identifiers from the page content using a regular expression.
- Searches for patterns (e.g., vwo_code, vwo_settings) in the HTML content.

`src/waitForVwoGlobals.js`

- Waits for the VWO-related global variables (window.VWO or window.\_vwo_exp) to be populated on the page.
- Uses a timeout (default 5000ms) to ensure that the script does not wait indefinitely.

`src/extractTestInfo.js`

- Extracts detailed VWO test information from the page context by evaluating the page.
- Retrieves objects such as window.\_vwo_exp and window.VWO from the browser context.

`src/structureResult.js`

- Restructures the raw extraction data into a more organized format before saving it to MongoDB.
- Groups data into logical sections such as metadata (URL, scanned timestamp), network data (requests, identifiers, responses), and test information.

Additional Notes
The project uses Puppeteer for browser automation and MongoDB for data storage. You can customize the timeout durations or the structure of the output by modifying the respective helper modules.

## Additional Information

Besides the above tech stack (NodeJS, Puppeteer, MongoDB), I only utilized ChatGPT to help me with understanding VWO, what tools I can use to scrape information from it, and helping break down the information being extracted from the sites.
