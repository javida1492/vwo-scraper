import puppeteer from "puppeteer"

/**
 * Launch a headless browser instance.
 * @returns {Promise<Browser>}
 */
export const launchBrowserInstance = async () => {
  return await puppeteer.launch({ headless: true })
}
