const extractTestInfo = async (page) => {
  const detailedTestInfo = await page.evaluate(() => {
    return {
      vwoExp: window._vwo_exp || null,
      vwoData: window.VWO || null,
    }
  })
  return detailedTestInfo
}

module.exports = extractTestInfo
