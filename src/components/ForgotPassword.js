import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import emailjs from 'emailjs-com'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import { forgotPassword } from '../api/apiCaller'
import {
  YOUR_SERVICE_ID,
  FORGOT_TEMPLATE_ID,
  YOUR_PUBLIC_KEY,
  FROM_EMAIL,
} from '../config'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Type should be email')
    .required('Email is required'),
  userid: yup.string().required('UserID is required'),
})

const ForgotPassowrd = () => {
  const navigate = useNavigate()
  const initialValues = { email: '', password: '' }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { email, userid } = values
      forgotPassword({ email, userid })
        .then(({ data }) => {
          emailjs
            .send(
              YOUR_SERVICE_ID,
              FORGOT_TEMPLATE_ID,
              {
                from: FROM_EMAIL,
                to: email,
                link: data?.link,
              },
              YOUR_PUBLIC_KEY
            )
            .then((result) => {
              toast.success('Please check your email')
            })
            .catch((error) => {
              toast.error('Sending an email was failed')
            })
        })
        .catch((error) => {
          toast.error(error?.message || "Can't find the email and user ID")
        })
    },
  })

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}
    >
      <Card
        sx={{
          display: 'flex',
          padding: '30px',
          height: 'fit-content',
          boxShadow: '0px 2px 10px 4px rgb(0 0 0 / 20%)',
          justifyContent: 'center',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Typography
            variant='h5'
            sx={{
              display: 'flex',
              marginBottom: '20px',
              justifyContent: 'center',
            }}
          >
            Reset password
          </Typography>
          <TextField
            id='email'
            type='email'
            label='Email'
            variant='standard'
            sx={{ width: '100%', marginBottom: 3 }}
            onChange={formik.handleChange}
          />
          <TextField
            id='userid'
            type='text'
            label='User ID'
            variant='standard'
            sx={{ width: '100%', marginBottom: 3 }}
            onChange={formik.handleChange}
          />
          <Button
            fullWidth
            variant='contained'
            type='submit'
            sx={{ marginTop: 3 }}
          >
            Reset Password
          </Button>
          <Button
            fullWidth
            variant='outlined'
            type='button'
            sx={{ marginTop: 3 }}
            onClick={() => {
              navigate('/login')
            }}
          >
            Back
          </Button>
        </form>
      </Card>
    </Box>
  )
}

export default ForgotPassowrd
