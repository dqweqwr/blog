import { useState } from "react"
import PropTypes from "prop-types"

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const login = (e) => {
    e.preventDefault()

    handleLogin(username, password)
  }

  return (
    <form onSubmit={login}>
      <div>
        <label htmlFor="username">username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Log in</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
