import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Menu, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Settings, Logout, MoreVert } from '@mui/icons-material'

import { CurrentUserContext } from '../contexts/currentUser'
import Account from '../containers/Account'

const Navbar = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
  color: white;
  margin-right: 15px;
`

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const value = useContext(CurrentUserContext)
  const [account, setAccount] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ height: '60px', backgroundColor: 'primary.dark' }} color='white'>
      <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
        <Navbar
          sx={{
            paddingLeft: '50px',
            fontSize: '25px',
            pointer: 'cursor',
            textDecoration: 'auto',
          }}
          to='#'
        >
          CFE TAX SERVICES
        </Navbar>
        <Box
          sx={{
            marginLeft: 'auto',
            height: '100%',
            display: 'flex',
            cursor: 'pointer',
            paddingRight: '50px',
          }}
        >
          {localStorage.getItem('token') ? (
            <>
              <Button
                id='username'
                sx={{ color: 'white' }}
                aria-controls={open ? 'username-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                endIcon={<MoreVert />}
                onClick={handleClick}
              >
                {value?.currentUser?.username}
              </Button>
              <Menu
                id='username-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'username',
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAccount(true)
                    handleClose()
                  }}
                >
                  <Settings sx={{ marginRight: '10px' }} />
                  Account
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem('token')
                    value.createCurrentUser({})
                    handleClose()
                    navigate('/login')
                  }}
                >
                  <Logout sx={{ marginRight: '10px' }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Navbar to='/login' sx={{ cursor: 'pointer' }}>
              Login
            </Navbar>
          )}
        </Box>
      </Box>
      <Account open={account} setOpen={setAccount} />
    </Box>
  )
}

export default Header
