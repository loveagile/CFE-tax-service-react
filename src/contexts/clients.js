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
      if (client._id === data?.data?.user?._id) {
        return data?.data?.user
      } else {
        return client
      }
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
