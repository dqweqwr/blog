const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash("123456", saltRounds)

  const newUser = new User({
    username: "testuser",
    name: "Dave",
    passwordHash: hashedPassword,
  })

  await newUser.save()
})

describe("POST /api/login", () => {
  test("returns 401 unauthorized if password is invalid", async () => {
    const loginCredentials = {
      username: "testuser",
      password: "wrongpassword",
    }

    const result = await api
      .post("/api/login")
      .send(loginCredentials)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toBe("Invalid username or password")
  })

  test("returns 401 unauthorized if username is invalid", async () => {
    const loginCredentials = {
      username: "thisuserdoesntexist",
      password: "123456",
    }

    const result = await api
      .post("/api/login")
      .send(loginCredentials)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toBe("Invalid username or password")
  })

  test("returns 200 OK and JWT when password and username match", async () => {
    const loginCredentials = {
      username: "testuser",
      password: "123456",
    }

    const result = await api
      .post("/api/login")
      .send(loginCredentials)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(result.body.token).not.toBe(undefined)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
