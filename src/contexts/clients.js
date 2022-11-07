import React, { useState } from 'react'

export const ClientContext = React.createContext()

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([])

  const addClient = (data) => {
    const list = [...clients]
    list.push(data)
    setClients(list)
  }

  const updateClient = (data) => {
    const list = clients.map((client) => {
      return client._id === data?._id ? data : client
    })
    setClients(list)
  }

  return (
    <ClientContext.Provider
      value={{ clients, setClients, addClient, updateClient }}
    >
      {children}
    </ClientContext.Provider>
  )
}
