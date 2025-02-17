const setupPageHandlers = (page, url, vwoRequests, detailedResponses) => {
  // Capture network requests related to VWO
  page.on("request", (request) => {
    const reqUrl = request.url()
    if (reqUrl.toLowerCase().includes("vwo")) {
      console.log(`[${url}] VWO-related request: ${reqUrl}`)
      vwoRequests.push(reqUrl)
    }
  })

  // Capture detailed responses (JSON) for VWO requests
  page.on("response", async (response) => {
    const resUrl = response.url().toLowerCase()
    if (resUrl.includes("vwo") && resUrl.endsWith(".json")) {
      try {
        const json = await response.json()
        detailedResponses.push({ url: resUrl, data: json })
      } catch (e) {
        // Ignore non-JSON responses.
      }
    }
  })
}

module.exports = setupPageHandlers
