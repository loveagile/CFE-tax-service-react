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
            const obj = {
              email: data?.user?.email,
              name: data?.user?.firstname + ' ' + data?.user?.lastname,
              message: `Your account was added successfully to CFE Tax Service.
            Email address: ${data?.user?.email}
            Username: ${data?.user?.username}
            Password: 12345678`,
            }
            // console.log('current', current)
            // toast.success('A client was added successfully')
            // emailjs
            //   .sendForm(
            //     YOUR_SERVICE_ID,
            //     YOUR_TEMPLATE_ID,
            //     current,
            //     YOUR_PUBLIC_KEY
            //   )
            //   .then((res) => {
            //     toast.success('An email was sent successfully')
            //   })
            //   .catch((error) => {
            //     toast.error('An email was failed')
            //   })
          })
          .catch((error) => {
            toast.error('The adding user was failed')
          })
      } else {
        updateClient(values).then(({ data }) => {
          value.updateClient(data?.user)
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

  function handleEmail(e) {
    e.preventDefault() //This is important, i'm not sure why, but the email won't send without it

    console.log('submit', e.target.email.value)
    // sendEmail({
    //   email: e.target.email.value,
    //   firstname: e.target.firstname.value,
    //   lastname: e.target.lastname.value,
    //   username: e.target.username.value,
    // })
    //   .then((result) => {
    //     console.log('success', result)
    //   })
    //   .catch((error) => {
    //     console.error('error', error)
    //   })
    emailjs
      .send(
        YOUR_SERVICE_ID,
        YOUR_TEMPLATE_ID,
        {
          email: e.target.email.value,
          firstname: e.target.firstname.value,
          lastname: e.target.lastname.value,
          username: e.target.username.value,
        },
        YOUR_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log('result', result)
          window.location.reload() //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }
  return (
    <Dialog open={open} onClose={handleCancel}>
      <form className='contact-form' onSubmit={handleEmail}>
        <input type='hidden' name='contact_number' />
        <label>firstname</label>
        <input type='text' name='firstname' />
        <label>lastname</label>
        <input type='text' name='lastname' />
        <label>Email</label>
        <input type='email' name='email' />
        <label>username</label>
        <input type='text' name='username' />
        <input type='submit' value='Send' />
      </form>
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
