import { useState } from "react"

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const showDeleteButton = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser")

    if (loggedUserJSON === null) return false

    const loggedUser = JSON.parse(loggedUserJSON).username
    const blogUser = blog.user.username
    return loggedUser === blogUser
  }

  return (
    <div className="blog-listing">
      <div>
        title: {blog.title}
        {" "}
        author: {blog.author}
        {" "}
        <button onClick={toggleShowDetails}>
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails &&
        <>
          <div>url: {blog.url}</div>
          <div>
            likes: {blog.likes}
            {" "}
            <button onClick={() => updateLikes(blog.id)}>
              like
            </button>
          </div>
          <div>Posted by: {blog.user.username}</div>
          {showDeleteButton() &&
            <button onClick={() => deleteBlog(blog.id)}>
              delete
            </button>
          }
        </>
      }
    </div>
  )
}

export default Blog
