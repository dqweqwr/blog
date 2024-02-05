const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 6) {
    return response.status(400).send({
      error: "password has to be at least 6 characters",
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
    author: 1,
  })
  response.json(users)
})

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
    author: 1,
  })
  response.json(user)
})

module.exports = usersRouter
