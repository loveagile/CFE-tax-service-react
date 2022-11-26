import React, { useState, useCallback } from 'react'

export const MessageContext = React.createContext()

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([])

  const addMessage = useCallback(
    (data) => {
      setMessages([...messages, data])
    },
    [messages]
  )

  return (
    <MessageContext.Provider value={{ messages, setMessages, addMessage }}>
      {children}
    </MessageContext.Provider>
  )
}
