import { extractExperimentData } from "./extractExperimentData.js"
import { setTimeout } from "timers/promises"

/**
 * Process a single website: open page, extract data, and store it in MongoDB.
 * @param {string} targetURL - The URL of the website to process.
 * @param {Browser} browser - Puppeteer browser instance.
 * @param {Collection} collection - MongoDB collection.
 */
export const processWebsite = async (targetURL, browser, collection) => {
  const page = await browser.newPage()
  try {
    await page.goto(targetURL, { waitUntil: "networkidle2" })

    // Wait for 2 seconds
    await setTimeout(2000)

    const extractedData = await extractExperimentData(page)

    const finalOutput = {
      url: targetURL,
      timestamp: new Date(),
      experimentIds: extractedData.experimentIds || [],
      experiments: extractedData.experiments || {},
    }

    console.log("Final Structured Data for", targetURL, ":", finalOutput)

    const insertResult = await collection.insertOne(finalOutput)
    console.log(
      `Data inserted for ${targetURL} with ID:`,
      insertResult.insertedId
    )
  } catch (err) {
    console.error(`Error processing ${targetURL}:`, err)
  } finally {
    await page.close()
  }
}
