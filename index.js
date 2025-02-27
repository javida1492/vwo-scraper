import { connectToMongo } from "./src/connectToMongo.js"
import { launchBrowserInstance } from "./src/launchBrowserInstance.js"
import { processWebsite } from "./src/processWebsite.js"

/**
 * Main function to process multiple websites.
 */
async function main() {
  // List of websites to process
  const websites = [
    "https://www.anker.com/",
    "https://www.tonal.com/",
    "https://www.rugsusa.com/",
    "https://www.humnutrition.com/",
    "https://www.bragg.com/",
    "https://flyingtiger.com/",
    "https://vessi.com/",
    "https://wineracksamerica.com/",
    "https://onecountry.com/",
  ]

  // MongoDB connection
  const uri = "mongodb://localhost:27017"
  const { client, collection } = await connectToMongo(
    uri,
    "vwoScraperDB",
    "experiments7"
  )

  // Launch a single browser instance for efficiency
  const browser = await launchBrowserInstance()

  // Process each website sequentially
  for (const targetURL of websites) {
    await processWebsite(targetURL, browser, collection)
  }

  await client.close()
  await browser.close()
}

main().catch((err) => {
  console.error("Error in main:", err)
})
