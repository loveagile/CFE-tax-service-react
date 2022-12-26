import React, { useContext, useEffect, useRef, useState } from 'react'
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
import emailjs from 'emailjs-com'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import { ClientContext } from '../contexts/clients'
import { createClient, updateClient, sendEmail } from '../api/apiCaller'
import { YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY } from '../config'

const validationSchema = yup.object({
  firstname: yup.string().required('Firstname is required'),
  lastname: yup.string().required('Lastname is required'),
  email: yup.string().email().required('Email is required'),
  IDNumber: yup.string().required('ID is required'),
  username: yup.string().required('Username is required'),
})

const UserModal = (props) => {
  const { open, setOpen, user, type } = props
  const [current, setCurrent] = useState({})
  const form = useRef()
  const value = useContext(ClientContext)

  useEffect(() => {
    setCurrent(form.current)
  }, [form.current])

  const formik = useFormik({
    initialValues: user,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (type === 'add') {
        createClient(values)
          .then(({ data }) => {
            value.addClient(data?.user)
            toast.success('A client has been added successfully')
            emailjs
              .send(
                YOUR_SERVICE_ID,
                YOUR_TEMPLATE_ID,
                {
                  email: data?.user?.email,
                  firstname: data?.user?.firstname,
                  lastname: data?.user?.lastname,
                  username: data?.user?.username,
                  password: '12345678',
                },
                YOUR_PUBLIC_KEY
              )
              .then(
                (result) => {
                  toast.success('An email was sent successfully')
                },
                (error) => {
                  toast.error('Sending an email was failed')
                }
              )
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.error || 'The adding client was failed'
            )
          })
      } else {
        updateClient(values)
          .then(({ data }) => {
            value.updateClient(data?.user)
            toast.success('The client has been updated successfully')
            emailjs
              .send(
                YOUR_SERVICE_ID,
                YOUR_TEMPLATE_ID,
                {
                  email: data?.user?.email,
                  firstname: data?.user?.firstname,
                  lastname: data?.user?.lastname,
                  username: data?.user?.username,
                },
                YOUR_PUBLIC_KEY
              )
              .then(
                (result) => {
                  toast.success('An email was sent successfully')
                },
                (error) => {
                  toast.error('Sending an email was failed')
                }
              )
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.error || 'The updating client was failed'
            )
          })
      }
      formik.setValues(user)
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
        <form ref={form} onSubmit={formik.handleSubmit}>
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
            sx={{ width: '100%', padding: '10px' }}
            onChange={formik.handleChange}
          />
          <TextField
            id='email'
            label='Email*'
            variant='standard'
            value={formik.values?.email}
            sx={{ width: '100%', padding: '10px' }}
            onChange={formik.handleChange}
          />
          <Box sx={{ display: 'flex' }}>
            <TextField
              error={formik.validateField.IDNumber}
              id='IDNumber'
              label='ID Number*'
              variant='standard'
              value={formik.values?.IDNumber}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
            <TextField
              id='username'
              label='Username'
              variant='standard'
              value={formik.values?.username}
              sx={{ width: '50%', padding: '10px' }}
              onChange={formik.handleChange}
            />
          </Box>
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
