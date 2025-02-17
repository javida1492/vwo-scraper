const { setTimeout } = require("node:timers/promises")

const setupPageHandlers = require("./setupPageHandlers")
const extractIdentifiers = require("./extractIdentifiers")
const waitForVwoGlobals = require("./waitForVwoGlobals")
const extractTestInfo = require("./extractTestInfo")
const structureResult = require("./structureResult")

async function extractVwoInfo(url, browser) {
  console.log(`Scanning: ${url}`)
  const page = await browser.newPage()
  const vwoRequests = []
  const detailedResponses = []

  // Set up network event handlers on the page
  setupPageHandlers(page, url, vwoRequests, detailedResponses)

  try {
    await page.goto(url, { waitUntil: "networkidle2" })
  } catch (error) {
    console.error(`Error loading ${url}:`, error)
    await page.close()
    return null
  }

  // Wait briefly for asynchronous VWO variables to populate.
  await setTimeout(5000)

  // Get the page content and extract potential VWO identifiers.
  const content = await page.content()
  const vwoIdentifiers = extractIdentifiers(content)
  console.log(`[${url}] Found potential VWO identifiers:`, vwoIdentifiers)

  // Wait for VWO globals to appear on the page.
  await waitForVwoGlobals(page, url, 5000)

  // Extract detailed VWO test info from the page context.
  const detailedTestInfo = await extractTestInfo(page)

  await page.close()

  // Build the raw result.
  const rawResult = {
    url,
    vwoRequests,
    vwoIdentifiers,
    detailedResponses,
    detailedTestInfo,
    scannedAt: new Date(),
  }

  // Return the structured result.
  return structureResult(rawResult)
}

module.exports = { extractVwoInfo }
