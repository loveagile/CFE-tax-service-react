import React, { useState } from 'react'

export const MessageContext = React.createContext()

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState()

  const addMessage = (data) => {
    const list = [...messages]
    list.push(data)
    setMessages(list)
  }

  return (
    <MessageContext.Provider value={{ messages, setMessages, addMessage }}>
      {children}
    </MessageContext.Provider>
  )
}
