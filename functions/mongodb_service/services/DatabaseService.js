const { MongoClient } = require('mongodb')
const AppConstants = require('../constants')

class DatabaseService {
  static #instance = null

  #init = async () => {
    if (!DatabaseService.#instance) {
      const client = new MongoClient(
        process.env[AppConstants.Env.MongodbConnectionUrl],
        {
          connectTimeoutMS: 10000
        }
      )

      await client.connect()
      DatabaseService.#instance = client.db(
        process.env[AppConstants.Env.DatabaseName]
      )
    }
  }

  isCollectionExists = async () => {
    await this.#init()
    const collectionName = this.getCollectionName()
    const collections = await DatabaseService.#instance
      .listCollections()
      .toArray()

    return collections.some((col) => col.name === collectionName)
  }

  getCollectionName = () => {
    return process.env[AppConstants.Env.CollectionName]
  }

  getCollection = async () => {
    await this.#init()
    return DatabaseService.#instance.collection(this.getCollectionName())
  }

  static getInstance = () => {
    return new DatabaseService()
  }
}

module.exports = DatabaseService
