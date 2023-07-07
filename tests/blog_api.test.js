const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const helper = require("./blog_api_test_helper")

mongoose.set("bufferTimeoutMS", 20000)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects
    .map(blog => blog.save())
  await Promise.all(promiseArray)
})

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
    const newBlog = {
      title: "new blog asdf",
      author: "abc",
      url: "https://www.asdf.com",
      likes: 20,
    }

    await api.post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.getBlogs()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain("new blog asdf")
  })

  test("When likes property is missing from request body, set default value to 0", async () => {
    const newBlog = {
      title: "another new blog",
      author: "asdf",
      url: "https://www.asdf.com"
    }

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const likes = response.body.likes
    expect(likes).toBe(0)
  })

  test("when title is missing, response code is 400", async () => {
    const newBlog = {
      author: "forgot the title",
      url: "https://www.asdf.com",
      likes: 100
    }

    await api.post("/api/blogs")
      .send(newBlog)
      .expect(400)
  })

  test("when author is missing, response code is 400", async () => {
    const newBlog = {
      title: "new blog",
      author: "forgot the url",
      likes: 100
    }

    await api.post("/api/blogs")
      .send(newBlog)
      .expect(400)
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
})

describe("DELETE /api/blogs/:id", () => {
  test("successfully deletes blog", async () => {
    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.getBlogs()
    expect(blogsAtStart.length - 1).toBe(blogsAtEnd.length)

    const blogIds = blogsAtEnd.map(blog => blog.id)
    expect(blogIds).not.toContain(blogToDelete.id)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
