import { MongoClient } from "mongodb"

/**
 * Connect to MongoDB and return the collection.
 * @param {string} uri - MongoDB URI.
 * @param {string} dbName - Database name.
 * @param {string} collectionName - Collection name.
 * @returns {Promise<{client: MongoClient, collection: any}>}
 */
export const connectToMongo = async (uri, dbName, collectionName) => {
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  await client.connect()
  const database = client.db(dbName)
  const collection = database.collection(collectionName)
  return { client, collection }
}
