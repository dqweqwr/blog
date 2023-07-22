const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const middleware = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  })
  response.json(blog)
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    ...body,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  await savedBlog.populate("user", { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.post(
  "/:id/comments",
  middleware.userExtractor,
  async (request, response) => {
    const comment = request.body
    const blog = await Blog.findById(request.params.id)

    blog.comments = blog.comments.concat(comment)
    await blog.save()

    return response.status(200).json(comment)
  },
)

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog === null) return response.status(204).end()

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: "you dont own this resource" })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  },
)

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body

  updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: "query" },
  )

  if (updatedBlog === null) {
    return response.status(404).json({ error: "Blog does not exist" })
  }

  await updatedBlog.populate("user", { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
