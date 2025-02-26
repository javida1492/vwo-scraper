/**
 * Extract experiment data from the page.
 * @param {Page} page - Puppeteer page instance.
 * @returns {Promise<Object>} Extracted experiment data.
 */
export const extractExperimentData = async (page) => {
  return (
    (await page.evaluate(() => {
      const result = {
        experimentIds: [],
        experiments: {},
        rawData: {
          _vwo_exp: null,
          _vwo_exp_ids: null,
          _vwo_code: null,
          _vwo_settings_timer: null,
          VWO: null,
        },
      }

      try {
        // Extract experiment IDs
        if (window._vwo_exp_ids) {
          result.experimentIds = window._vwo_exp_ids
        }

        // Process experiments if available
        if (window._vwo_exp) {
          Object.keys(window._vwo_exp).forEach((expId) => {
            const exp = window._vwo_exp[expId]
            if (exp.status !== "RUNNING") return // Only process running experiments

            // Extract variations
            let variations = null
            if (exp.sections && exp.sections["1"]) {
              const varData = exp.sections["1"].variations
              if (
                varData &&
                typeof varData === "object" &&
                Object.keys(varData).length > 0
              ) {
                variations = varData
              }
            }

            // Extract goals as is
            const goals = exp.goals || {}

            // Audience processing
            let audience = exp.segment_code
            let audienceCriteria = null
            if (audience === "true") {
              audience = "All"
            } else {
              audienceCriteria = exp.segment_code
              audience = "Custom"
            }

            // Variation mapping extraction
            let variationMapping = null
            if (
              exp.comb_n &&
              typeof exp.comb_n === "object" &&
              Object.keys(exp.comb_n).length > 0
            ) {
              variationMapping = exp.comb_n
            }

            // Use exp.st (if provided) as startTime
            const startTime = exp.st || null

            result.experiments[expId] = {
              name: exp.name || null,
              type: exp.type || null,
              status: exp.status || null,
              trafficSplit: exp.pc_traffic || null,
              version: exp.version || null,
              startTime: startTime,
              endTime: exp.ep || null,
              manual: exp.manual || false,
              clickmap: exp.clickmap || null,
              multipleDomains: !!exp.multiple_domains,
              audience: audience,
              audienceCriteria: audienceCriteria,
              variationMapping: variationMapping,
              variations: variations,
              goals: goals,
              additionalRaw: {
                globalCode: exp.globalCode || null,
                mutations: exp.muts || null,
                isEventMigrated: exp.isEventMigrated || null,
                exec: exp.exec || null,
                combinationChosen: exp.combination_chosen || null,
              },
            }
          })
        }

        // Capture raw data
        result.rawData = {
          _vwo_exp: window._vwo_exp || null,
          _vwo_exp_ids: window._vwo_exp_ids || null,
          _vwo_code: window._vwo_code || null,
          _vwo_settings_timer: window._vwo_settings_timer || null,
          VWO: window.VWO || null,
        }
      } catch (err) {
        console.error("Error in page.evaluate:", err)
      }
      return result
    })) || {}
  )
}
