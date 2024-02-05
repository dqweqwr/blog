const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")
const bcrypt = require("bcrypt")

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash("123456", saltRounds)

  const newUser = new User({
    username: "johnson",
    name: "Johnson",
    passwordHash,
  })

  await newUser.save()
}, 10000)

describe("POST /api/users", () => {
  test("successfully creates a account when all input is valid and username is unique", async () => {
    const newUser = {
      username: "testuser",
      name: "Bob",
      password: "12345678",
    }

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const body = response.body
    expect(body.name).toEqual("Bob")
    expect(body.username).toEqual("testuser")
    expect(body.passwordHash).toEqual(undefined)
  })

  test("when username is too short dont create account", async () => {
    const newUser = {
      username: "q",
      name: "Bob",
      password: "12345678",
    }

    await api.post("/api/users").send(newUser).expect(400)
  })

  test("when password is too short dont create account", async () => {
    const newUser = {
      username: "testuser",
      name: "Bob",
      password: "123",
    }

    await api.post("/api/users").send(newUser).expect(400)
  })

  test("fails when trying to create account with a already existing username", async () => {
    const newUser = {
      username: "johnson",
      name: "Bob",
      password: "12345678",
    }

    await api.post("/api/users").send(newUser).expect(400)
  })
})

describe("GET /api/users", () => {
  test("gets all users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body.length).toBe(1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
