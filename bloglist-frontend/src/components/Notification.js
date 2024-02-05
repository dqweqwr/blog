const Notification = ({ message }) => {
  if (message === null) return null

  return (
    <div className={message.type}>
      {message.value}
    </div>
  )
}

export default Notification
