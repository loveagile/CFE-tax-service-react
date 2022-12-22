import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, TextField, Typography, Button } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import { getResetToken, updatePassword } from '../api/apiCaller'

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is a required field'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is a required field'),
})

const initialValues = {
  password: '',
  confirm: '',
}

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState()
  const { token } = useParams()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { password } = values
      updatePassword(user?._id, password)
        .then(({ data }) => {
          toast.success('Password was set successfully')
          navigate('/login')
        })
        .catch((error) => {
          toast.error(error?.message || "Password didn't save")
        })
    },
  })

  useEffect(() => {
    getResetToken(token)
      .then(({ data }) => {
        setUser(data?.user)
        setIsLoading(false)
      })
      .catch((error) => {
        toast.error(error?.message || 'The token is not correct')
      })
  }, [])

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '30px',
          height: 'fit-content',
          boxShadow: '0px 2px 10px 4px rgb(0 0 0 / 20%)',
          justifyContent: 'center',
        }}
      >
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
        {isLoading && (
          <Typography
            sx={{ display: 'flex', justifyContent: 'center', fontSize: '20px' }}
          >
            Loading User Data...
          </Typography>
        )}
        {!isLoading && (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              id='password'
              type='password'
              label='Password'
              variant='standard'
              sx={{ width: '100%', marginBottom: 3 }}
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
              type='password'
              label='Password Confirm'
              variant='standard'
              sx={{ width: '100%', marginBottom: 3 }}
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
              To login
            </Button>
          </form>
        )}
      </Card>
    </Box>
  )
}

export default ResetPassword
