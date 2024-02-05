import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios
    .post(baseUrl, newBlog, config)

  return response.data
}

const update = async (id, newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios
    .put(`${baseUrl}/${id}`, newBlog, config)

  return response.data
}

const destroy = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios
    .delete(`${baseUrl}/${id}`, config)
}

const blogService = { getAll, create, update, destroy, setToken }
export default blogService
