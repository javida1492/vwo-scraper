const extractIdentifiers = (content) => {
  // Match identifiers like "vwo_xyz123"
  const vwoIdentifiers = content.match(/vwo_[a-zA-Z0-9]+/g) || []
  return vwoIdentifiers
}

module.exports = extractIdentifiers
