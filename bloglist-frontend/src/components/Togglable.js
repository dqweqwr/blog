import { useState, forwardRef, useImperativeHandle } from "react"

const Togglable = forwardRef((props, refs) => {
  const { buttonLabel } = props
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? "" : "none" }
  const hideWhenVisible = { display: visible ? "none" : "" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
})

Togglable.displayName = "Togglable"

export default Togglable
