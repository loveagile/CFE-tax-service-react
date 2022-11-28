import React, { useContext, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  Box,
  TextField,
  Typography,
  Button,
  Input,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { CurrentUserContext } from '../contexts/currentUser'
import { updateAccount } from '../api/apiCaller'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is a required field'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is a required field'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is a required field'),
})

const form = {
  email: '',
  password: '',
  confirm: '',
}
const Account = (props) => {
  const { open, setOpen } = props
  const user = useContext(CurrentUserContext)
  let initValues = form
  const formik = useFormik({
    initialValues: initValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateAccount(values)
        .then((data) => {
          toast.success('Account was updated successfully.')
        })
        .catch((error) => {
          toast.error(error)
        })
      handleCancel()
    },
  })

  useEffect(() => {
    initValues = form
  })

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Edit account</DialogTitle>
      <Box sx={{ padding: '20px' }}>
        <Typography sx={{ fontSize: '14px', paddingLeft: '10px' }}>
          Current Email
        </Typography>
        <Input
          disabled
          sx={{ fontSize: '18px', width: '100%', paddingLeft: '10px' }}
          defaultValue={user.currentUser?.email}
        />
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <TextField
              id='email'
              label='Email'
              variant='standard'
              sx={{
                width: '300px',
                padding: '10px',
              }}
              onChange={formik.handleChange}
            />
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'start',
                fontSize: '12px',
                width: '100%',
                color: 'red',
              }}
            >
              {formik.touched.email && formik.errors.email}
            </Typography>
            <TextField
              id='password'
              label='Password'
              variant='standard'
              sx={{
                width: '300px',
                padding: '10px',
              }}
              onChange={formik.handleChange}
            />
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'start',
                fontSize: '12px',
                width: '100%',
                color: 'red',
              }}
            >
              {formik.touched.password && formik.errors.password}
            </Typography>
            <TextField
              id='confirm'
              label='Password Confirm'
              variant='standard'
              sx={{
                width: '300px',
                padding: '10px',
              }}
              onChange={formik.handleChange}
            />
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'start',
                fontSize: '12px',
                width: '100%',
                color: 'red',
              }}
            >
              {formik.touched.confirm && formik.errors.confirm}
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                marginTop: '10px',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                type='submit'
                variant='contained'
                startIcon={<Save />}
                sx={{ marginRight: '20px' }}
              >
                Save
              </Button>
              <Button
                variant='outlined'
                startIcon={<Cancel />}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancel()
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Dialog>
  )
}

export default Account
