/*
    5000ms for the timeout is essentially a safeguard.
    We want to make sure we allow enough time for VWO-related
    global variables to load on the page without causing the 
    process to hang indefinitely. 

    If the variables arent available within the time frame,
    the function logs a warning and moves on. This ensures the
    scraping process doesnt get stuck waiting forever on a page
    that might never load those variables.

*/
const waitForVwoGlobals = async (page, url, timeout = 5000) => {
  await page
    .waitForFunction(
      () =>
        (window.VWO && Object.keys(window.VWO).length > 0) ||
        (window._vwo_exp && Object.keys(window._vwo_exp).length > 0),
      { timeout }
    )
    .catch(() => {
      console.warn(`[${url}] VWO variables may not be fully loaded`)
    })
}

module.exports = waitForVwoGlobals
