const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return response.status(401).json({
      error: "Invalid username or password",
    })
  }

  const tokenPayload = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(tokenPayload, process.env.SECRET)

  response.status(200).json({
    username: user.username,
    name: user.name,
    token,
  })
})

module.exports = loginRouter
