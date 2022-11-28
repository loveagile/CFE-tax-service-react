import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MessageIcon from '@mui/icons-material/Message'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'

import { CurrentUserContext } from '../contexts/currentUser'

const Sidebar = () => {
  const navigate = useNavigate()
  const sides = [
    {
      name: 'Profie',
      url: '/profile',
      icon: <InsertDriveFileIcon sx={{ color: 'white' }} />,
    },
    {
      name: 'Messenger',
      url: '/messages',
      icon: <MessageIcon sx={{ color: 'white' }} />,
    },
  ]
  const value = useContext(CurrentUserContext)
  if (value?.currentUser?.role === 'admin') {
    sides.unshift({
      name: 'Clients',
      url: '/clients',
      icon: <PeopleAltIcon sx={{ color: 'white' }} />,
    })
  } else {
    sides.unshift({
      name: 'Files',
      url: '/files',
      icon: <InsertDriveFileIcon sx={{ color: 'white' }} />,
    })
  }
  if (!value.currentUser || !localStorage.getItem('token')) {
    return <></>
  }

  return (
    <Box
      sx={{
        width: '250px',
        height: window.innerHeight - 60,
        backgroundColor: 'primary.main',
        padding: '0px',
      }}
      role='presentation'
    >
      <List>
        {sides.map((side) => (
          <ListItem
            key={side.name}
            sx={{ paddingLeft: '0px', paddingRight: '0px' }}
            onClick={() => {
              navigate(side.url)
            }}
          >
            <ListItemButton>
              <ListItemIcon sx={{ marginLeft: '10px' }} on>
                {side?.icon}
              </ListItemIcon>
              <ListItemText
                primary={side.name}
                sx={{ color: 'white' }}
              ></ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Sidebar
