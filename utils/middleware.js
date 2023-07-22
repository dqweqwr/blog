const logger = require("./logger")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "")
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    response.status(401).json({ error: "token invalid" })
  }
  const user = await User.findById(decodedToken.id)
  if (user !== null) {
    request.user = user
  }
  next()
}

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("body:  ", request.body)
  logger.info("---")
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message })
  } else if (error.name === "CastError") {
    response.status(400).json({ error: "malformatted id" })
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: error.message })
  } else if (error.name === "SyntaxError") {
    response.status(401).json({ error: "invalid token" })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
