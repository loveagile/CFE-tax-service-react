import { Box, SnackbarContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

const MessageBox = styled(SnackbarContent)((props) => {
  return {
    received: `
      &:after {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 15px solid transparent;
        border-right: 15px solid #474749;
        border-top: 0px solid #474749;
        border-bottom: 15px solid transparent;
        left: -24px;
        top: 13px;
      }
    `,
    sent: `
      &:after {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 15px solid #fff;
        border-right: 15px solid transparent;
        border-top: 0px solid #fff;
        border-bottom: 15px solid transparent;
        right: -26px;
      }
    `,
  }[props.className]
})

const MessageItem = (props) => {
  const { content, sender, date } = props

  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: '10px',
        position: 'relative',
        justifyContent: sender ? 'right' : 'left',
      }}
    >
      <MessageBox
        message={<div dangerouslySetInnerHTML={{ __html: content }} />}
        className={sender ? 'sent' : 'received'}
        sx={{
          maxWidth: '60%',
          minWidth: '0px !important',
          borderRadius: '15px',
          backgroundColor: sender ? '#fff' : '#474749',
          color: sender ? '#000' : '#fff',
          '& .MuiSnackbarContent-message': {
            marginLeft: sender ? 'auto' : '',
            marginRight: sender ? '15px' : '',
          },
        }}
      ></MessageBox>
      <Typography sx={{ fontSize: '10px' }}>{date}</Typography>
    </Box>
  )
}

export default MessageItem
