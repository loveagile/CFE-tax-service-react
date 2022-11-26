import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  AppBar,
  Tabs,
  Tab,
  Fab,
  IconButton,
} from '@mui/material'
import { Add, Save, Check, Delete } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { green, red } from '@mui/material/colors'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as yup from 'yup'

import ConfirmModal from '../components/ConfirmModal'
import {
  getProfile,
  createProfile,
  getDependents,
  createDependent,
  updateDependent,
  deleteDependent,
} from '../api/apiCaller'

const validationDependentSchema = yup.object({
  firstname: yup.string().required('Firstname is required'),
  lastname: yup.string().required('Lastname is required'),
  ssn: yup.string().email().required('Email is required'),
})

const newDepen = [
  {
    firstname: '',
    lastname: '',
    ssn: '',
    birth: new Date(),
  },
]
const initProfile = {
  tax_ssn: '',
  tax_firstname: '',
  tax_lastname: '',
  tax_email: '',
  tax_phone: '',
  tax_birth: null,
  spo_ssn: '',
  spo_firstname: '',
  spo_lastname: '',
  spo_email: '',
  spo_phone: '',
  spo_birth: null,
  address: '',
  city: '',
  state: '',
  zip: '',
  county: '',
}

const Profile = () => {
  const theme = useTheme()
  const [init, setInit] = useState(initProfile)
  const [value, setValue] = useState(0)
  const [dependents, setDependents] = useState(newDepen)
  const [depen, setDepen] = useState(newDepen[0])
  const [open, setOpen] = useState(false)
  const [taxBirth, setTaxBirth] = useState(null)
  const [spoBirth, setSpoBirth] = useState(null)
  const [birth, setBirth] = useState(null)

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setInit(data.profile || initProfile)
      })
      .catch((error) => {
        toast.error('Getting profile is failed')
      })

    getDependents()
      .then(({ data }) => {
        if (data.dependents && data.dependents.length) {
          setDependents(data.dependents)
          setDepen(data.dependents[0])
          setBirth(data.dependents[0].birth)
          if (value >= data.dependents.length)
            setValue(data.dependents.length - 1)
        } else {
          setDependents(newDepen)
          setDepen(newDepen[0])
          setBirth(new Date())
          setValue(0)
        }
      })
      .catch((error) => {
        toast.error('Getting profile is failed')
      })
  }, [])

  const formik = useFormik({
    initialValues: init,
    onSubmit: (values) => {
      values.tax_birth = taxBirth
      values.spo_birth = spoBirth
      createProfile(values)
        .then((data) => {
          toast.success('Profile was saved successfully!')
        })
        .catch((err) => {
          toast.error('Saving profile was failed')
        })
    },
  })

  const dependentFormik = useFormik({
    initialValues: depen,
    validatioinSchema: validationDependentSchema,
    onSubmit: (values) => {
      values.birth = birth
      if (values._id) {
        updateDependent(values)
          .then(({ data }) => {
            const list =
              dependents.length &&
              dependents.map((dependent) => {
                return data?.dependent?._id === dependent?._id
                  ? data.dependent
                  : dependent
              })
            setDependents(list)
            toast.success('Updating the dependent was succeed.')
          })
          .catch((err) => {
            toast.error('Updating the dependent was failed')
          })
      } else {
        createDependent(values)
          .then(({ data }) => {
            getDependents().then(({ data }) => {
              setDependents(data?.dependents)
              toast.success('Creating a dependent was succeed')
            })
          })
          .catch((err) => {
            toast.error('Creating the dependent was failed')
          })
      }
    },
  })

  useEffect(() => {
    formik.setValues(init)
  }, [init])

  useEffect(() => {
    dependentFormik.setValues(depen)
  }, [depen])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setDepen(dependents[newValue])
    setBirth(dependents[newValue].birth)
  }
  const handleChangeIndex = (index) => {
    setValue(index)
    setDepen(dependents[index])
    setBirth(dependents[index].birth)
  }
  const handleAddDependent = () => {
    setValue(dependents.length)
    setDependents([...dependents, newDepen[0]])
    dependentFormik.setValues(newDepen[0])
    setBirth(new Date())
  }
  const handleDeleteDependent = (value) => {
    deleteDependent(value)
      .then(() => {
        getDependents().then(({ data }) => {
          if (data.dependents.length) {
            setDependents(data?.dependents)
            setDepen(data?.dependents[0])
          } else {
            setDependents(newDepen)
            setDepen(newDepen[0])
          }
          setValue(0)
        })
        toast.success('Deleting was succeed')
      })
      .catch((err) => {
        toast.error('Deleting was failed')
      })
  }

  return (
    <Box sx={{ overflowY: 'auto', height: window.innerHeight - 120 }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex' }}>
          <Card sx={{ width: '50%', padding: '10px', margin: '10px' }}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Taxpayer
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='tax_ssn'
                  label='SSN'
                  variant='standard'
                  value={formik.values?.tax_ssn}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='tax_firstname'
                  label='First Name'
                  variant='standard'
                  value={formik.values?.tax_firstname}
                  sx={{ width: '50%', paddingRight: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
                <TextField
                  name='tax_lastname'
                  label='Last Name'
                  variant='standard'
                  value={formik.values?.tax_lastname}
                  sx={{ width: '50%', paddingLeft: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='tax_phone'
                  label='Phone'
                  variant='standard'
                  value={formik.values?.tax_phone}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='tax_email'
                  label='Email'
                  variant='standard'
                  value={formik.values?.tax_email}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label='Date of Birth'
                    name='tax_birth'
                    inputFormat='MM/DD/YYYY'
                    value={taxBirth}
                    onChange={(value) => {
                      setTaxBirth(value)
                    }}
                    renderInput={(params) => (
                      <TextField
                        variant='standard'
                        {...params}
                        sx={{
                          width: '100%',
                          marginTop: '20px',
                        }}
                      />
                    )}
                  ></MobileDatePicker>
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: '50%', padding: '10px', margin: '10px' }}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Spouse
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='spo_ssn'
                  label='SSN'
                  variant='standard'
                  value={formik.values?.spo_ssn}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='spo_firstname'
                  label='First Name'
                  variant='standard'
                  value={formik.values?.spo_firstname}
                  sx={{ width: '50%', paddingRight: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
                <TextField
                  name='spo_lastname'
                  label='Last Name'
                  variant='standard'
                  value={formik.values?.spo_lastname}
                  sx={{ width: '50%', paddingLeft: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='spo_phone'
                  label='Phone'
                  variant='standard'
                  value={formik.values?.spo_phone}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='spo_email'
                  label='Email'
                  variant='standard'
                  value={formik.values?.spo_email}
                  sx={{ width: '100%', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label='Date of Birth'
                    name='spo_birth'
                    inputFormat='MM/DD/YYYY'
                    value={spoBirth}
                    onChange={(value) => {
                      setSpoBirth(value)
                    }}
                    renderInput={(params) => (
                      <TextField
                        variant='standard'
                        {...params}
                        sx={{
                          width: '100%',
                          marginTop: '20px',
                        }}
                      />
                    )}
                  ></MobileDatePicker>
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ marginTop: '10px' }}>
          <Card sx={{ padding: '10px', margin: '10px' }}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Mailing Address
              </Typography>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <TextField
                  name='address'
                  label='Address'
                  variant='standard'
                  value={formik.values?.address}
                  sx={{ width: '50%', paddingRight: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
                <TextField
                  name='city'
                  label='City'
                  variant='standard'
                  value={formik.values?.city}
                  sx={{ width: '50%', paddingLeft: '10px', marginTop: '20px' }}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  name='state'
                  label='State'
                  variant='standard'
                  value={formik.values?.state}
                  sx={{
                    width: '33.3%',
                    paddingRight: '10px',
                    marginTop: '20px',
                  }}
                  onChange={formik.handleChange}
                />
                <TextField
                  name='zip'
                  label='Zip'
                  variant='standard'
                  value={formik.values?.zip}
                  sx={{
                    width: '33.3%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    marginTop: '20px',
                  }}
                  onChange={formik.handleChange}
                />
                <TextField
                  name='county'
                  label='County'
                  variant='standard'
                  value={formik.values?.county}
                  sx={{
                    width: '33.3%',
                    paddingLeft: '10px',
                    marginTop: '20px',
                  }}
                  onChange={formik.handleChange}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
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
            startIcon={<Save />}
          >
            Save
          </Button>
        </Box>
      </form>
      <Box sx={{ marginTop: '10px' }}>
        <Card sx={{ padding: '10px', margin: '10px' }}>
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              Dependents
            </Typography>
            <AppBar
              position='static'
              color='default'
              sx={{
                boxShadow: 'revert',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #949494',
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor='primary'
                textcolor='primary'
              >
                {dependents.length &&
                  dependents.map((dependent, index) => (
                    <Tab
                      label={`dependent ${index + 1}`}
                      id={`dependent-${index}`}
                      aria-controls={`tabpanel-${index}`}
                      key={index}
                    />
                  ))}
                <IconButton
                  color='primary'
                  aria-label='add dependent'
                  onClick={handleAddDependent}
                >
                  <Add />
                </IconButton>
              </Tabs>
            </AppBar>
            <Box
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              sx={{ padding: '10px' }}
              onChangeIndex={handleChangeIndex}
            >
              {dependents.length &&
                dependents.map((dependent, index) => {
                  return (
                    <Box hidden={value !== index} key={index}>
                      <form onSubmit={dependentFormik.handleSubmit}>
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          <TextField
                            name='firstname'
                            label='First Name'
                            variant='standard'
                            value={dependentFormik.values?.firstname}
                            sx={{
                              width: '50%',
                              paddingRight: '10px',
                              marginTop: '20px',
                            }}
                            onChange={dependentFormik.handleChange}
                          />
                          <TextField
                            name='lastname'
                            label='Last Name'
                            variant='standard'
                            value={dependentFormik.values?.lastname}
                            sx={{
                              width: '50%',
                              paddingLeft: '10px',
                              marginTop: '20px',
                            }}
                            onChange={dependentFormik.handleChange}
                          />
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <TextField
                            name='ssn'
                            label='SSN'
                            variant='standard'
                            value={dependentFormik.values?.ssn}
                            sx={{
                              width: '100%',
                              marginTop: '20px',
                            }}
                            onChange={dependentFormik.handleChange}
                          />
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              label='Date of Birth'
                              name='birth'
                              inputFormat='MM/DD/YYYY'
                              value={birth}
                              onChange={(value) => {
                                setBirth(value)
                              }}
                              renderInput={(params) => (
                                <TextField
                                  variant='standard'
                                  {...params}
                                  sx={{
                                    width: '100%',
                                    marginTop: '20px',
                                  }}
                                />
                              )}
                            ></MobileDatePicker>
                          </LocalizationProvider>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            width: '100%',
                            marginTop: '20px',
                          }}
                        >
                          <Fab
                            type='submit'
                            sx={{
                              marginLeft: 'auto',
                              padding: '10px',
                              backgroundColor: green[500],
                              color: 'white',
                              '&:hover': {
                                backgroundColor: green[600],
                              },
                              marginRight: '10px',
                            }}
                            aria-label='Add'
                          >
                            <Check />
                          </Fab>
                          <Fab
                            sx={{
                              padding: '10px',
                              backgroundColor: red[500],
                              color: 'white',
                              '&:hover': {
                                backgroundColor: red[600],
                              },
                            }}
                            aria-label='Delete'
                            onClick={() => setOpen(true)}
                          >
                            <Delete />
                          </Fab>
                        </Box>
                      </form>
                    </Box>
                  )
                })}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        handleDelete={() => handleDeleteDependent(depen)}
        title='Delete'
        content='Do you want to delete this dependent?'
      />
    </Box>
  )
}

export default Profile
