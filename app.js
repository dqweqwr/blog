const config = require("./utils/config")
const logger = require("./utils/logger")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const blogsRouter = require("./controller/blogs")
const usersRouter = require("./controller/users")
const loginRouter = require("./controller/login")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

logger.info("Connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch(err => {
    logger.error("Error occured connecting to MongoDB", err)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter, middleware.userExtractor)
app.use("/api/users", usersRouter)

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controller/testing")
  app.use("/api/testing", testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
