const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

// finds the sum of likes in all blog posts
const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const allLikes = likes.reduce(
    (sum, currentValue) => sum += currentValue,
    0
  ) 

  return allLikes
}

// finds which blog has the most likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let currentFavorite = blogs[0]
  blogs.forEach(blog => {
    if (blog.likes > currentFavorite.likes) {
      currentFavorite = blog
    }
  })

  return currentFavorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const groupedBlogs = _.groupBy(blogs, "author")
  const authorBlogList = _.map(groupedBlogs, (blogs, author) => {
    return { author, blogs: blogs.length }
  })
  const authorWithMostBlogs = _.maxBy(authorBlogList, "blogs")
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const groupedBlogs = _.groupBy(blogs, "author")
  const authorLikesList = _.map(groupedBlogs, (blogs, author) => {
    return { author, likes: totalLikes(blogs) }
  })
  const authorWithMostLikes = _.maxBy(authorLikesList, "likes")
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
