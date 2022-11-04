import React, { useContext } from 'react'
import { Box } from '@mui/material'

import Header from './Header'
import Sidebar from './Sidebar'
import { CurrentUserContext } from '../contexts/currentUser'

const Layout = ({ children }) => {
  const value = useContext(CurrentUserContext)

  return (
    <Box sx={{ backgroundColor: '#ddd' }}>
      <Header></Header>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          paddingLeft: '0px',
          backgroundColor: 'white',
          display: 'flex',
        }}
      >
        {value?.currentUser && localStorage.getItem('token') && <Sidebar />}
        <Box sx={{ padding: '30px', width: '100%' }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default Layout
