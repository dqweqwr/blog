const Blog = require("../models/blog")

const initialBlogs = [
  {
    title: "Bob's blog",
    author: "Bob",
    url: "https://www.bobsblog.com",
    likes: 20,
  },
  {
    title: "Jeff's blog",
    author: "Jeff",
    url: "https://www.jeffsblog.com",
    likes: 10,
  },
  {
    title: "Will's blog",
    author: "Will",
    url: "https://www.willsblog.com",
    likes: 3,
  },
]

const nonExistentBlog = async () => {
  const blog = new Blog({
    title: "Josh's blog",
    author: "Josh",
    url: "https://www.joshsblog.com",
    likes: 50
  })
  
  await blog.save()
  await blog.deleteOne()
  return blog
}

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, getBlogs, nonExistentBlog
}
