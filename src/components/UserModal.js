import React, { useContext, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Box,
  Divider,
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { ClientContext } from '../contexts/clients'
import { createClient, updateClient } from '../api/apiCaller'

const validationSchema = yup.object({
  firstname: yup.string().required('Firstname is required'),
  lastname: yup.string().required('Lastname is required'),
  email: yup.string().email().required('Email is required'),
  IDNumber: yup.string().required('ID is required'),
  username: yup.string().required('Username is required'),
})

const UserModal = (props) => {
  const { open, setOpen, user, type } = props
  const value = useContext(ClientContext)

  const formik = useFormik({
    initialValues: user,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (type === 'add') {
        createClient(values).then((data) => {
          value.addClient(data?.data?.user)
        })
      } else {
        updateClient(values).then((data) => {
          value.updateClient(data?.data?.user)
        })
      }
      handleCancel()
    },
  })

  useEffect(() => {
    formik.setValues(user)
  }, [user])

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle sx={{ margin: 'auto' }}>
        {type === 'add' ? 'Add a client' : 'Edit a client'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              name='firstname'
              label='Firstname*'
              variant='standard'
              value={formik.values?.firstname}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
            <TextField
              id='lastname'
              label='Lastname*'
              variant='standard'
              value={formik.values?.lastname}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
          </Box>
          <Divider variant='fullWidth' sx={{ padding: '5px' }} />
          <TextField
            id='business'
            label='Business'
            variant='standard'
            value={formik.values?.business}
            sx={{ width: '50%' }}
            onChange={formik.handleChange}
          />
          <Box sx={{ display: 'flex' }}>
            <TextField
              id='email'
              label='Email*'
              variant='standard'
              value={formik.values?.email}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
            <TextField
              error={formik.validateField.IDNumber}
              id='IDNumber'
              label='ID Number*'
              variant='standard'
              value={formik.values?.IDNumber}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
          </Box>
          <TextField
            id='username'
            label='Username'
            variant='standard'
            value={formik.values?.username}
            sx={{ width: '50%' }}
            onChange={formik.handleChange}
          />
          <Divider variant='fullWidth' sx={{ padding: '5px' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '10px',
            }}
          >
            <Button
              variant='contained'
              type='submit'
              sx={{
                marginRight: '10px',
                paddingLeft: '25px',
                paddingRight: '25px',
              }}
            >
              Save
            </Button>
            <Button variant='outlined' onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserModal
