import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import socketClient from 'socket.io-client'
import { Box, Stack, TextareaAutosize, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

import MessageItem from '../components/MessageItem'
import { CurrentUserContext } from '../contexts/currentUser'
import { MessageContext } from '../contexts/messages'
import { getMessages } from '../api/apiCaller'
import theme from '../theme'
import { SERVER } from '../config'

const Messages = () => {
  const receiver = useParams().id || ''
  const value = useContext(MessageContext)
  const userValue = useContext(CurrentUserContext)
  const [content, setContent] = useState('')
  const socket = socketClient(SERVER)

  useEffect(() => {
    getMessages(receiver)
      .then((data) => {
        value.setMessages(data?.data?.messages)
      })
      .catch((error) => {
        toast.error(error.error)
      })
    configureSocket()
  }, [])

  const configureSocket = () => {
    socket.on('messages', (message) => {
      value.addMessage(message)
    })
  }

  const handleSend = () => {
    const data = {
      sender: userValue?.currentUser?._id,
      receiver,
      content: content.replaceAll('\n', '<br />'),
      date: new Date(),
    }
    socket.emit('send-message', data)
    setContent('')
  }

  return (
    <Box spacing={2}>
      <Stack
        sx={{
          maxHeight: window.innerHeight - 180,
          overflowY: 'auto',
          padding: '10px',
        }}
      >
        {value.messages?.map((message, id) => (
          <MessageItem
            key={id}
            content={message.content}
            sender={message.sender === userValue.currentUser._id}
          ></MessageItem>
        ))}
      </Stack>
      <Box sx={{ display: 'flex', padding: '10px' }}>
        <TextareaAutosize
          maxRows={3}
          minRows={2}
          aria-label='input-board'
          placeholder='Write a message'
          value={content}
          sx={{
            border: '2px solid #00c6f9',
            paddingLeft: '10px',
            borderRadius: '5px',
            fontSize: '15px',
          }}
          style={{ width: window.innerWidth - 350 }}
          onChange={(event) => {
            setContent(event.target.value)
          }}
        />
        <IconButton
          size='small'
          onClick={handleSend}
          sx={{ color: theme.palette.primary.dark, marginLeft: '20px' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Messages
