const config = require("./utils/config")
const logger = require("./utils/logger")
const express = require("express")
const app = express()
const cors = require("cors")
const blogsRouter = require("./controller/blogs")
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
app.use(middleware.requestLogger)

app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
