const express = require('express')
const { v4: uuidV4 } = require('uuid')
const AppConstants = require('./constants')
const { AuthService, DatabaseService } = require('./services')
const { AppError, ErrorHandler, DocumentUtil } = require('./utils')

const app = express()
app.use(express.json())

app.use(async (req, res, next) => {
  try {
    const databaseService = DatabaseService.getInstance()
    if (
      !AuthService.getInstance().isValidRequest(
        req.get(AppConstants.Headers.CodelibSecretKey)
      )
    ) {
      throw new AppError(
        401,
        "You don't have permission to perform this operation. Kindly contact your administrator for more details."
      )
    }
    await databaseService.isCollectionExists().then((isCollectionExists) => {
      if (!isCollectionExists) {
        throw new AppError(
          400,
          `Collection '${databaseService.getCollectionName()}' does not exist`
        )
      }
    })
    next()
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)

    res.status(statusCode).send(others)
  }
})

app.get('/document/:document_id', async (req, res) => {
  try {
    /* eslint-disable-next-line camelcase */
    const { document_id } = req.params

    /* eslint-disable-next-line camelcase */
    const filter = { _id: document_id }

    const collection = await DatabaseService.getInstance().getCollection()
    const data = await collection.findOne(filter)

    if (!data) {
      throw new AppError(404, 'No such document with the given id exists.')
    }
    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.get('/documents', async (req, res) => {
  try {
    const { page, perPage } = DocumentUtil.verifyAndProcessPaginationParams(
      req.query.page,
      req.query.perPage
    )

    const offset = (page - 1) * perPage

    const collection = await DatabaseService.getInstance().getCollection()

    const totalRecords = parseInt(await collection.countDocuments())
    const totalPages = Math.ceil(totalRecords / perPage)
    const hasMore = page < totalPages

    const data = await collection
      .find({})
      .skip(offset)
      .limit(perPage)
      .toArray()

    res.status(200).send({
      status: 'success',
      data: {
        data,
        page: {
          page,
          hasMore,
          perPage,
          totalPages,
          totalRecords
        }
      }
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.post('/documents', async (req, res) => {
  try {
    const payload = req.body
    DocumentUtil.validatePayload(payload, 'payload', 'create')

    const data = payload.map((item) => ({
      ...item,
      _id: uuidV4()
    }))

    const collection = await DatabaseService.getInstance().getCollection()
    await collection.insertMany(data)

    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.put('/documents', async (req, res) => {
  try {
    const identifiers = []
    const payload = req.body

    DocumentUtil.validatePayload(payload, 'payload', 'update')
    DocumentUtil.validateUpdatePayload(payload, '_id')

    const collection = await DatabaseService.getInstance().getCollection()

    await collection.bulkWrite(
      payload.map((item) => {
        const _id = item._id
        identifiers.push(_id)

        delete item._id

        return {
          updateOne: {
            filter: { _id },
            update: { $set: item }
          }
        }
      })
    )

    const data = await collection
      .find({
        _id: { $in: identifiers }
      })
      .toArray()

    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.delete('/document/:document_id', async (req, res) => {
  try {
    /* eslint-disable-next-line camelcase */
    const { document_id } = req.params

    /* eslint-disable-next-line camelcase */
    const filter = { _id: document_id }

    const collection = await DatabaseService.getInstance().getCollection()
    const data = await collection.findOne(filter)

    if (!data) {
      throw new AppError(404, 'No such document with the given id exists.')
    }

    await collection.deleteOne({
      _id: document_id /* eslint-disable-line camelcase */
    })

    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.delete('/documents', async (req, res) => {
  try {
    const identifiers = req.query.ids?.split(',')

    DocumentUtil.validatePayload(identifiers, 'ids', 'delete')

    const collection = await DatabaseService.getInstance().getCollection()

    const filter = { _id: { $in: identifiers } }

    const data = await collection.find(filter).toArray()

    await collection.deleteMany(filter)

    res.status(200).send({
      status: 'success',
      data
    })
  } catch (err) {
    const { statusCode, ...others } =
      ErrorHandler.getInstance().processError(err)
    res.status(statusCode).send(others)
  }
})

app.all('*', function (_req, res) {
  res.status(404).send({
    status: 'failure',
    message: "We couldn't find the requested url."
  })
})

module.exports = app
