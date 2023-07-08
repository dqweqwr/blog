const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./blog_api_test_helper")

mongoose.set("bufferTimeoutMS", 20000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const alice = await helper.createUser("alice")

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog({
      ...blog,
      user: alice._id
    })
    const savedBlog = await blogObject.save()
    alice.blogs = alice.blogs.concat(savedBlog._id)
    await alice.save()
  }
}, 100000)

describe("GET /api/blogs", () => {
  test("list of blogs is returned as json", async () => {
    await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
  })

  test("number of blogs returned matches length of initalBlogs array", async () => {
    const response = await api
      .get("/api/blogs")

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("unique identifier of blog posts is named 'id'", async () => {
    const response = await api
      .get("/api/blogs")
    response.body.map(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeFalsy()
    })
  })
})

describe("POST /api/blogs", () => {
  test("successfully creates a new blog", async () => {
    const user = await User.findOne({ username: "alice" })
    const token = helper.generateToken(user)

    const newBlog = {
      title: "new blog asdf",
      author: "abc",
      url: "https://www.asdf.com",
      likes: 20,
    }

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.getBlogs()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain("new blog asdf")
  })

  test("When likes property is missing from request body, set default value to 0", async () => {
    const user = await User.findOne({ username: "alice" })
    const token = helper.generateToken(user)

    const newBlog = {
      title: "another new blog",
      author: "asdf",
      url: "https://www.asdf.com"
    }

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const likes = response.body.likes
    expect(likes).toBe(0)
  })

  test("when title is missing, response code is 400", async () => {
    const user = await User.findOne({ username: "alice" })
    const token = helper.generateToken(user)

    const newBlog = {
      author: "forgot the title",
      url: "https://www.asdf.com",
      likes: 100
    }

    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test("when author is missing, response code is 400", async () => {
    const user = await User.findOne({ username: "alice" })
    const token = helper.generateToken(user)

    const newBlog = {
      title: "new blog",
      author: "forgot the url",
      likes: 100
    }

    await api.post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test("when no token is given, response code is 401", async () => {
    const newBlog = {
      title: "new blog asdf",
      author: "abc",
      url: "https://www.asdf.com",
      likes: 20,
    }

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })
})

describe("PUT /api/blogs/:id", () => {
  test("updates a blog correctly", async () => {
    const blogsAtStart = await helper.getBlogs()

    const firstBlog = blogsAtStart[0]
    const newBlog = {
      ...firstBlog,
      likes: firstBlog.likes + 1
    }

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(newBlog)
      .expect(200)

    const updatedBlog = await Blog.findById(firstBlog.id)
    expect(updatedBlog.likes).toBe(firstBlog.likes + 1)
  })

  test("does not update blog if updated fields are invalid", async () => {
    const blogsAtStart = await helper.getBlogs()
    const firstBlog = blogsAtStart[0]
    const newBlog = {
      ...firstBlog,
      url: null
    }

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(newBlog)
      .expect(400)
  })

  test("returns status code 400 for malformatted id", async () => {
    const id = "asdf"
    const newBlog = {
      title: "Hello world",
      author: "Bob",
      url: "bobsblog.com",
      likes: 2000
    }

    const response = await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(response.body.error).toBe("malformatted id")
  })

  test("returns status code 404 for blog that doesnt exist", async () => {
    const nonExistentBlog = await helper.nonExistentBlog()
    const nonExistentId = nonExistentBlog._id.toString()

    const newBlog = {
      title: "Hello world",
      author: "Bob",
      url: "bobsblog.com",
      likes: 2000
    }

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(newBlog)
      .expect(404)
  })
})

describe("DELETE /api/blogs/:id", () => {
  test("successfully deletes blog if id of user in decrypted token and blog id match", async () => {
    const user = await User.findOne({ username: "alice" })
    const token = helper.generateToken(user)

    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.getBlogs()
    expect(blogsAtStart.length - 1).toBe(blogsAtEnd.length)

    const blogIds = blogsAtEnd.map(blog => blog.id)
    expect(blogIds).not.toContain(blogToDelete.id)
  })

  test("returns 401 and does not delete blog when user who doesnt own the blog trys to delete it", async () => {
    const user = await helper.createUser("bob")
    const token = helper.generateToken(user)

    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await helper.getBlogs()
    expect(blogsAtStart.length).toBe(blogsAtEnd.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
