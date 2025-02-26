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

## Solution Approach

Not being entirely familiar with ways of scraping data, I initially researched on different technologies/ways of scraping data from websites and the two main options were:

- Python-based stack which could be paired with BeautifulSoup or lxml for static pages where the content is directly in the HTML or Selenium with a headless browser if the data is injected via JS.
- A NodeJS stack utilizing Puppeteer for dynamic pages or Cheerio to fetch and parse static HTML content.

My main source of research was ChatGPT and google but I also reference the VWO API documentation and some stackoverflow posts where users were trying to inject JS into their website via VWO, which gave me better insight into what the JS might look like.

I opted for NodeJS due to stronger familiarity with the language. Likewise, I believe running headless browsers would also be ok as the script could be lifted into serveless functions in AWS or modified to do concurrent processing for all of the websites versus sequential processing. This would allow better throughput BUT would require more system resources.

For the database choice, I opted for MongoDB as the _shape_ of the data was initially unknown. Without being able to access the VWO dashboards, but even more importantly, integrate with the VWO APIs, we cannot confidently say what this shape will or should look like. As a result, I felt mongo would be a great fit as we wont have a rigid schema defined and because the data might change in the future (e.g. VWO might remove information or change their implementation patterns, breaking any rigid schemas we define), it is easier to maintain the mongo schema as any prior data would not be forced to change for any new data schemas.

I did my best to provide data fields I felt would be relevant for analytical purposes but there may be additional, unnecessary information. That being said, I've also provided detailed information regarding the current schema, mapping the the fields, values, and provided field information.

This data was retrieved through multiple scrapes, processing initially the entire raw data and then extracting the relevant information from it into a structure i felt would be acceptable if this were to be the response of an API. Essentially i refined my approach with each scrape to isolate relevant information while removing redundant/useless information.

If needed, the script can easily be modified to inject the pure raw window data containing all of the experiment information but this data is very dirty and not very usable for analytical purposes.

## File Descriptions

### index.js

- **Purpose:**  
  The main entry point of the application. It coordinates the overall workflow:
  - Imports necessary modules.
  - Establishes the MongoDB connection.
  - Launches the Puppeteer browser.
  - Processes a list of websites sequentially.
  - Closes the database connection and browser after processing.
- **Usage:**  
  Run the script with `npm start` (or `node index.js`).

### launchBrowsrInstance.js

- **Purpose:**  
  This module handles the creation of the Puppeteer browser instance.
- **Exports:**
  - `launchBrowserInstance`: A function that launches and returns a headless browser instance.
- **Usage:**  
  Import and call this function to obtain a Puppeteer browser instance for navigating pages.

### extractExperimentData.js

- **Purpose:**  
  Contains the logic for extracting experiment-related data from a webpage. This includes:
  - Experiment IDs.
  - Details about experiments, variations, goals, and additional raw configuration data.
- **Exports:**
  - `extractExperimentData`: A function that runs in the page context to extract data and returns a structured object.
- **Usage:**  
  Call this function with a Puppeteer page instance to retrieve experiment data from that page.

### connectToMongo.js

- **Purpose:**  
  Provides a function to establish a connection with a MongoDB database and returns the target collection.
- **Exports:**
  - `connectToMongo`: A function that takes a MongoDB URI, database name, and collection name; returns a connected MongoClient instance and the collection.
- **Usage:**  
  Import and call this function to connect to your MongoDB database before processing data.

### processWebsite.js

- **Purpose:**  
  Orchestrates the processing of a single website:
  - Opens a new page.
  - Navigates to the target URL.
  - Waits briefly for page content to load.
  - Uses `extractExperimentData` to obtain the experiment data.
  - Logs the final structured data.
  - Inserts the data into the MongoDB collection.
- **Exports:**
  - `processWebsite`: A function that encapsulates the logic of processing one website and storing its data.
- **Usage:**  
  Call this function with the target URL, browser instance, and MongoDB collection to process and store data for a website.

# Experiment Object (per experiment ID)

This object represents an experiment configuration as defined in the VWO dashboard. Each field is described below.

## Main Fields

| Field                | Type           | Description & Example                                                                                                  |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **name**             | String         | The friendly name of the experiment. Example: `Heatmap`, `Visitor Sessions Recorded`, `Home Page Visits`.              |
| **type**             | String         | The type of experiment. Examples: `ANALYZE_HEATMAP`, `ANALYZE_RECORDING`, `TRACK`, `FUNNEL`, `VISUAL_AB`.              |
| **status**           | String         | Current status of the experiment. Typically `RUNNING` for active tests.                                                |
| **trafficSplit**     | Number         | Percentage of traffic allocated. Note: A value of `100` may indicate full traffic allocation or a scraping limitation. |
| **version**          | Number         | Internal version of the experiment configuration.                                                                      |
| **startTime**        | Number or null | Unix timestamp (ms) when the experiment is scheduled to start. `null` if not set.                                      |
| **endTime**          | Number         | Unix timestamp (ms) indicating when the experiment will end.                                                           |
| **manual**           | Boolean        | Indicates if the experiment requires manual activation.                                                                |
| **clickmap**         | Mixed          | Clickmap configuration; may be `null` or a numerical flag.                                                             |
| **multipleDomains**  | Boolean        | Specifies if the experiment runs across multiple domains.                                                              |
| **audience**         | String         | Simplified audience targeting. Example: `All`.                                                                         |
| **audienceCriteria** | Mixed          | Raw or structured audience criteria; `null` if not defined.                                                            |

## Variation Mapping

| Field                | Type   | Description & Example                                                           |
| -------------------- | ------ | ------------------------------------------------------------------------------- |
| **variationMapping** | Object | Maps variation IDs to labels. Example: `{ "1": "Control", "2": "Variation-1" }` |

## Variations

For control variations, this may be empty. For test variations, each object includes:

| Field     | Type    | Description & Example                                                     |
| --------- | ------- | ------------------------------------------------------------------------- |
| **xpath** | String  | DOM selector where the change is applied. Example: `/html/body/div`       |
| **js**    | String  | JavaScript code to be executed. Example: `console.log('Test Variation');` |
| **tag**   | String  | Internal tag or identifier for the variation.                             |
| **rtag**  | String  | Additional internal identifier.                                           |
| **dHE**   | Boolean | Flag indicating if the change should be applied dynamically.              |

## Goals

Mapping of goal IDs to their configurations. Each goal object includes:

| Field           | Type               | Description & Example                                                       |
| --------------- | ------------------ | --------------------------------------------------------------------------- |
| **pUrl**        | String             | Page URL pattern to track the goal. Example: `/checkout`                    |
| **urlRegex**    | String             | Alternate URL matching pattern.                                             |
| **excludeUrl**  | String             | Pattern of URLs where the goal should not fire.                             |
| **pExcludeUrl** | String             | Page exclude URL pattern.                                                   |
| **type**        | String             | Type of goal. Examples: `SEPARATE_PAGE`, `CUSTOM_GOAL`, `REVENUE_TRACKING`. |
| **pageVisited** | Boolean (optional) | Indicates if the goal tracks page visits.                                   |

> **Usage:** Goals measure conversion events by tying a conversion event to a specific experiment variation.

## Additional Raw Experiment Fields

Contains raw configuration data extracted directly from VWO settings.

| Field                 | Type    | Description & Example                                                                                  |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| **globalCode**        | String  | Raw code blocks (e.g., `<script></script>`).                                                           |
| **mutations**         | Object  | Contains `pre` and `post` mutation objects. Example: `{ "pre": {}, "post": {} }`                       |
| **isEventMigrated**   | Boolean | Flag indicating if the experiment’s event tracking has migrated to a new system.                       |
| **exec**              | Mixed   | Execution flag; often `null` if not applicable.                                                        |
| **combinationChosen** | Mixed   | The bucket combination assigned to the visitor; used for debugging or deeper analytics; may be `null`. |

## Additional Information

- **Experiment ID vs. Version:**  
  The key in the experiments object (e.g., `"4"`) is the unique experiment ID. The `version` field represents the internal configuration version and may change over time without changing the ID.

- **Pages vs. Goals:**  
  The `pages` field defines where experiment variations are shown, while the `goals` field specifies which pages trigger conversion events.

- **Variation Mapping and Variations:**  
  The `variationMapping` provides human-readable labels for each variation, and the `variations` field details the actual content changes (e.g., code injections or DOM modifications). If no changes are needed (as with a control), the `variations` field may be empty.
