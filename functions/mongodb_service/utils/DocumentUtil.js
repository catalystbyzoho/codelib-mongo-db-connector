const AppError = require('./AppError')
const AppConstants = require('../constants')

class DocumentUtil {
  static #NUMERIC_REGEX = /^\d+$/
  static #captalize = (fieldName) => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  }

  static verifyAndProcessPaginationParams = (page, perPage) => {
    if (!page) {
      throw new AppError(400, 'page cannot be empty.')
    }

    if (!perPage) {
      throw new AppError(400, 'perPage cannot be empty.')
    }

    if (!this.#NUMERIC_REGEX.test(page)) {
      throw new AppError(
        400,
        'Invalid value for page. page should be a positive number.'
      )
    }

    if (!this.#NUMERIC_REGEX.test(perPage)) {
      throw new AppError(
        400,
        'Invalid value for perPage. perPage should be a positive number.'
      )
    }

    page = parseInt(page)
    perPage = parseInt(perPage)

    if (page <= 0) {
      throw new AppError(
        400,
        'Invalid value for page. page should be a greater than 0.'
      )
    }

    if (perPage <= 0) {
      throw new AppError(
        400,
        'Invalid value for perPage. perPage should be a greater than 0.'
      )
    }

    if (perPage > AppConstants.MAX_RECORDS_PER_OPERATION) {
      throw new AppError(
        400,
        'Invalid value for perPage. perPage should be a less than or equal to ' +
          AppConstants.MAX_RECORDS_PER_OPERATION
      )
    }
    return {
      page,
      perPage
    }
  }

  static validateUpdatePayload = (payload, keyName) => {
    for (const item of payload) {
      if (!item._id) {
        throw new AppError(400, `${keyName} cannot be empty.`)
      }
    }
  }

  static validatePayload = (payload, fieldName, operation) => {
    if (!Array.isArray(payload)) {
      throw new AppError(
        400,
        `Invalid value for ${fieldName.toLowerCase()}. ${this.#captalize(
          fieldName
        )} should be an array`
      )
    }

    if (!payload.length) {
      throw new AppError(400, `${this.#captalize(fieldName)} cannot be empty.`)
    }

    if (payload.length > AppConstants.MAX_RECORDS_PER_OPERATION) {
      throw new AppError(
        403,
        `You can ${operation} a maximum of ${AppConstants.MAX_RECORDS_PER_OPERATION} per operation`
      )
    }
  }
}

module.exports = DocumentUtil
