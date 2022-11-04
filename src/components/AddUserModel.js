import React from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'

const AddUserModel = () => {
  const { open, setOpen } = props

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>New Client</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  )
}

export default AddUserModel
