import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import socketClient from 'socket.io-client'
import {
  Box,
  Stack,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

import MessageItem from '../components/MessageItem'
import { CurrentUserContext } from '../contexts/currentUser'
import { MessageContext } from '../contexts/messages'
import { getClients, getMessages } from '../api/apiCaller'
import theme from '../theme'
import { SERVER } from '../config'

const Messages = () => {
  const [receiver, setReceiver] = useState()
  const { messages, setMessages } = useContext(MessageContext)
  const userValue = useContext(CurrentUserContext)
  const [content, setContent] = useState('')
  const [users, setUsers] = useState()
  const socket = socketClient(SERVER)
  let param = useParams().id || ''

  useEffect(() => {
    if (userValue?.currentUser?.role === 'admin') {
      getClients().then((data) => {
        setUsers(data?.data?.users)
        setReceiver(data?.data?.users[0])
      })
    }
  }, [])

  useEffect(() => {
    if (userValue.currentUser?.role === 'admin') param = receiver?._id
    getMessages(param)
      .then((data) => {
        setMessages([...data?.data?.messages])
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [receiver])

  const handleSend = (e) => {
    e.preventDefault()

    const data = {
      sender: userValue?.currentUser?._id,
      receiver,
      content: content.replaceAll('\n', '<br />'),
      date: new Date(),
    }
    socket.emit('send-message', data)
    socket.on('new-message', (message) => {
      getMessages(receiver?._id)
        .then(({ data }) => {
          setMessages(data?.messages)
        })
        .catch((error) => {
          toast.error(error.message)
        })
    })
    setContent('')
  }

  const handleReceiver = (event) => {
    setReceiver(event.target.value)
  }

  return (
    <Box spacing={2}>
      <FormControl
        variant='standard'
        sx={{
          m: 1,
          minWidth: '150px',
          display: userValue?.currentUser?.role === 'admin' ? '' : 'none',
        }}
      >
        <InputLabel id='client-selector'>Client</InputLabel>
        {receiver && (
          <Select
            labelId='client-selector'
            id='selector'
            value={receiver}
            onChange={handleReceiver}
            label='Client'
          >
            {users?.map((user, index) => (
              <MenuItem value={user} autoFocus={true} key={index}>
                {`${user.firstname} ${user.lastname}`}{' '}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
      <Stack
        sx={{
          height:
            window.innerHeight -
            (userValue?.currentUser?.role === 'admin' ? 270 : 180),
          overflowY: 'auto',
          padding: '10px',
          paddingRight: '26px',
        }}
      >
        {messages?.map((message, id) => (
          <MessageItem
            key={id}
            content={message.content}
            sender={message.sender === userValue.currentUser._id}
          ></MessageItem>
        ))}
      </Stack>
      <form onSubmit={(e) => handleSend(e)}>
        <Box sx={{ display: 'flex', marginTop: '10px', width: '100%' }}>
          <TextField
            aria-label='input-board'
            placeholder='Write a message'
            value={content}
            sx={{
              borderRadius: '5px',
              fontSize: '15px',
              color: '#000',
              paddingLeft: '20px',
              marginLeft: '10px',
            }}
            style={{ width: '92%', fontSize: '15px' }}
            onChange={(event) => {
              setContent(event.target.value)
            }}
          />
          <IconButton
            size='small'
            type='submit'
            onClick={handleSend}
            sx={{ color: theme.palette.primary.dark, marginLeft: '20px' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  )
}

export default Messages
