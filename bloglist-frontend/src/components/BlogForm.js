import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addBlog = (e) => {
    e.preventDefault()

    const newBlog = {
      title, url, author
    }

    createBlog(newBlog)

    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <>
      <h2>Create new blog listing</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">Url: </label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author: </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </>
  )
}

export default BlogForm
