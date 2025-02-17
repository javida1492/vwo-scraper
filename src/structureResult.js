const structureResult = (rawResult) => {
  return {
    metadata: {
      url: rawResult.url,
      scannedAt: rawResult.scannedAt,
    },
    network: {
      requests: rawResult.vwoRequests,
      identifiers: rawResult.vwoIdentifiers,
      responses: rawResult.detailedResponses,
    },
    testInfo: rawResult.detailedTestInfo,
  }
}

module.exports = structureResult
