import { Box, SnackbarContent, Typography } from '@mui/material'
import React from 'react'

const MessageItem = (props) => {
  const { content, sender, date } = props

  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: '10px',
        justifyContent: sender ? 'right' : 'left',
      }}
    >
      <SnackbarContent
        message={<div dangerouslySetInnerHTML={{ __html: content }} />}
        sx={{
          maxWidth: '60%',
          minWidth: '0px !important',
          backgroundColor: '#004c9a',
          '& .MuiSnackbarContent-message': {
            marginLeft: sender ? 'auto' : '',
          },
        }}
      ></SnackbarContent>
      <Typography sx={{ fontSize: '10px' }}>{date}</Typography>
    </Box>
  )
}

export default MessageItem
