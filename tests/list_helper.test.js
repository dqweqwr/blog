const _ = require("lodash")
const listHelper = require("../utils/list_helper")

const listWithZeroBlogs = []

const listWithOneBlog = [
  {
    _id: "1234",
    title: "Bob's blog",
    author: "Bob",
    url: "https://www.bobsblog.com",
    likes: 10,
    __v: 0,
  },
]

const listWithBlogsWithSameLikes = [
  {
    _id: "2345",
    title: "Jeff's blog",
    author: "Jeff",
    url: "https://www.jeffsblog.com",
    likes: 10,
    __v: 0,
  },
  {
    _id: "1234",
    title: "Bob's blog",
    author: "Bob",
    url: "https://www.bobsblog.com",
    likes: 10,
    __v: 0,
  },
  {
    _id: "3456",
    title: "Will's blog",
    author: "Will",
    url: "https://www.willsblog.com",
    likes: 10,
    __v: 0,
  },
]

const listWithManyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
]

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(listWithZeroBlogs)

    expect(result).toBe(0)
  })

  test("when list only has one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    expect(result).toBe(10)
  })

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithManyBlogs)

    expect(result).toBe(36)
  })
})

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog(listWithZeroBlogs)

    expect(result).toBe(null)
  })

  test("when list only has one blog returns that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)

    expect(result).toEqual({
      _id: "1234",
      title: "Bob's blog",
      author: "Bob",
      url: "https://www.bobsblog.com",
      likes: 10,
      __v: 0,
    })
  })

  test("when list has blogs with same likes returns the first blog found", () => {
    const result = listHelper.favoriteBlog(listWithBlogsWithSameLikes)

    expect(result).toEqual({
      _id: "2345",
      title: "Jeff's blog",
      author: "Jeff",
      url: "https://www.jeffsblog.com",
      likes: 10,
      __v: 0,
    })
  })

  test("when list has many blogs returns the one with the most likes", () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)

    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    })
  })
})

describe("most blogs", () => {
  test("when list is empty return null", () => {
    const result = listHelper.mostBlogs(listWithZeroBlogs)

    expect(result).toBe(null)
  })

  test("when list has one blog return the author and blog count for that one", () => {
    const result = listHelper.mostBlogs(listWithOneBlog)

    expect(result).toEqual({ author: "Bob", blogs: 1 })
  })

  test("when list has many authors who have written one blog each return the first one found", () => {
    const result = listHelper.mostBlogs(listWithBlogsWithSameLikes)

    expect(result).toEqual({ author: "Jeff", blogs: 1 })
  })

  test("when list contains many authors with different blog counts, return the one who has the most blogs to his/her name", () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)

    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    })
  })
})

describe("most likes", () => {
  test("when list is empty return null", () => {
    const result = listHelper.mostLikes(listWithZeroBlogs)

    expect(result).toBe(null)
  })

  test("when list has one blog return the author and likes for that one", () => {
    const result = listHelper.mostLikes(listWithOneBlog)

    expect(result).toEqual({ author: "Bob", likes: 10 })
  })

  test("when list contains authors who all have the same amount of likes, return the first one found", () => {
    const result = listHelper.mostLikes(listWithBlogsWithSameLikes)

    expect(result).toEqual({ author: "Jeff", likes: 10 })
  })

  test("when list contains authors with different amounts of likes, return author with most likes across all blog posts", () => {
    const result = listHelper.mostLikes(listWithManyBlogs)

    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
  })
})
