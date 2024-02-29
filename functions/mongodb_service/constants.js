class AppConstants {
  static Headers = {
    CodelibSecretKey: 'catalyst-codelib-secret-key'
  }

  static Env = {
    MongodbConnectionUrl: 'MONGODB_CONNECTION_URL',
    CollectionName: 'COLLECTION_NAME',
    CodelibSecretKey: 'CODELIB_SECRET_KEY',
    DatabaseName: 'DATABASE_NAME'
  }

  static MAX_RECORDS_PER_OPERATION = 200
}

module.exports = AppConstants
