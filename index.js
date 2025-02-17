// Import required modules
const puppeteer = require("puppeteer")
const { MongoClient } = require("mongodb")
const { extractVwoInfo } = require("./src/extractVwoInfo")

// List of ecommerce store URLs using VWO
const urlList = [
  "https://www.anker.com/",
  //   "https://www.tonal.com/",
  //   "https://www.rugsusa.com/",
  //   "https://www.humnutrition.com/",
  //   "https://www.bragg.com/",
  //   "https://flyingtiger.com/",
  //   "https://vessi.com/",
  //   "https://wineracksamerica.com/",
  //   "https://onecountry.com/",
]

// MongoDB connection details
const mongoUrl = "mongodb://localhost:27017"
const dbName = "ecommerceVWO"

async function main() {
  // Connect to MongoDB
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true })
  await client.connect()
  console.log("Connected to MongoDB")
  const db = client.db(dbName)
  const collection = db.collection("vwoTests")

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({ headless: true })

  // Process each URL sequentially
  for (const url of urlList) {
    const data = await extractVwoInfo(url, browser)
    if (data) {
      // Insert the extracted data into MongoDB
      await collection.insertOne(data)
      console.log(`Data inserted for ${url}`)
    }
  }

  await browser.close()
  await client.close()
}

main().catch(console.error)
