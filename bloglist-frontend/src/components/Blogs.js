import Blog from "./Blog"

const Blogs = ({ blogs }) => {
  return (
    <>
      {blogs.map(blog => {
        return <Blog key={blog.id} blog={blog} />
      })}
    </>
  )
}

export default Blogs
