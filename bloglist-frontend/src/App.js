import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [sortByLikes, setSortByLikes] = useState(true)

  const blogFormRef = useRef()

  useEffect(() => {
    const initializeBlogList = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    initializeBlogList()
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedBlogListUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const handleLogin = async (username, password) => {
    const credentials = {
      username,
      password
    }

    try {
      const user = await loginService
        .login(credentials)

      window.localStorage.setItem(
        "loggedBlogListUser", JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)

      showNotification({
        type: "success",
        value: `Logged in as ${user.username}`
      })
    } catch (e) {
      showNotification({
        type: "error",
        value: "Invalid username or password"
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedBlogListUser")
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      showNotification({
        type: "success",
        value: `A new blog "${newBlog.title}" by ${newBlog.author} created`
      })
      blogFormRef.current.toggleVisibility()
    } catch (e) {
      const error = e.response.data.error

      showNotification({
        type: "error",
        value: error
      })
    }
  }

  const updateLikes = async (id) => {
    const blogToUpdate = blogs.find(b => b.id === id)

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id
    }

    try {
      const returnedBlog = await blogService
        .update(id, updatedBlog)

      const updatedBlogList = blogs.map(b => {
        return b.id === id ? returnedBlog : b
      })

      setBlogs(updatedBlogList)
    } catch (e) {
      const error = e.response.data.error

      showNotification({
        type: "error",
        value: error
      })
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    const confirmation = window.confirm("are you sure?")

    if (!confirmation) return

    try {
      await blogService.destroy(id)

      const updatedBlogList = blogs.filter(b => b.id !== id)
      setBlogs(updatedBlogList)

      showNotification({
        type: "success",
        value: `"${blogToDelete.title}" by ${blogToDelete.author} deleted`
      })
    } catch (e) {
      const error = e.response.data.error

      showNotification({
        type: "error",
        value: error
      })
    }
  }

  return (
    <div>
      <Notification message={message} />
      {!user &&
        <>
          <LoginForm handleLogin={handleLogin} />
          <div>
            User must be logged in to see blog list
          </div>
        </>
      }
      {user &&
        <>
          <h1>Blogs</h1>
          <div>
            Welcome back {user.username}!
            {" "}
            <button onClick={handleLogout}>
              Log out
            </button>
          </div>
          <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <br />
          <div>
            Sorted by:
            {" "}
            <button onClick={() => setSortByLikes(!sortByLikes)}>
              {sortByLikes ? "most liked" : "oldest"}
            </button>
            {" "}
            on top
          </div>
          <div className="list-of-blogs">
            {sortByLikes &&
              [...blogs].sort((a, b) => {
                return b.likes - a.likes
              }).map(blog => {
                return <Blog
                  key={blog.id}
                  blog={blog}
                  updateLikes={updateLikes}
                  deleteBlog={deleteBlog}
                />
              })
            }
            {!sortByLikes &&
              blogs.map(blog => {
                return <Blog
                  key={blog.id}
                  blog={blog}
                  updateLikes={updateLikes}
                  deleteBlog={deleteBlog}
                />
              })
            }
          </div>
        </>
      }
    </div>
  )
}

export default App
