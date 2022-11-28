import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import { toast } from 'react-toastify'

import { CategoriesContext } from '../contexts/categories'
import { uploadFiles } from '../api/apiCaller'

const FileUploadModal = (props) => {
  const { open, setOpen, categories, folder, flag, setFlag } = props
  const [files, setFiles] = useState([])
  const userId = useParams().id
  const value = useContext(CategoriesContext)
  const [category, setCategory] = useState(categories && categories[0])

  const onFileChange = (event) => {
    let list = []
    for (let i = 0; i < event.target.files.length; i++) {
      list.push(event.target.files[i])
    }
    setFiles(list)
  }

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    if (folder?._id) {
      formData.append('category', folder?._id)
    } else {
      formData.append('category', category?._id)
    }
    formData.append('to', userId)

    uploadFiles(formData)
      .then(({ data }) => {
        toast.success(`Uploaded ${data?.files.length} files successfully!`)
        value.addFiles(data?.files)
        setOpen(false)
        setFlag(!flag)
      })
      .catch((error) => {
        setFlag(!flag)
        toast.error(error.error)
      })
    handleCancel()
  }

  const handleCancel = () => {
    setCategory(0)
    setFiles([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Upload files</DialogTitle>
      <Box sx={{ minWidth: '200px', padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <FormControl
            sx={{ display: folder?._id ? 'none' : '', width: '100%' }}
            variant='standard'
          >
            <InputLabel
              id='category-select-label'
              placeholder='Select a folder'
            ></InputLabel>
            <Select
              labelId='category-select-label'
              id='category-select'
              sx={{ width: '100%' }}
              value={category}
              onChange={handleChange}
              label='Preparer'
            >
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant='standard'
            sx={{ marginTop: '20px', width: '100%' }}
          >
            <Button variant='outlined' component='label' startIcon={<Add />}>
              Add
              <input hidden multiple type='file' onChange={onFileChange} />
            </Button>
            {files &&
              files.map((file, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #555',
                      padding: '5px',
                    }}
                  >
                    <Typography sx={{ weight: 'bold' }}>{file.name}</Typography>
                    <Close
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        const list = [...files]
                        list.splice(index, 1)
                        setFiles(list)
                      }}
                    ></Close>
                  </Box>
                )
              })}
          </FormControl>
          <FormControl
            variant='standard'
            sx={{
              width: '100%',
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}
          >
            <Button
              type='submit'
              variant='contained'
              sx={{
                maxWidth: '100px',
                marginRight: '20px',
                width: 'auto',
              }}
            >
              Upload
            </Button>
            <Button
              variant='outlined'
              sx={{ maxWidth: '100px', width: 'auto' }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </FormControl>
        </form>
      </Box>
    </Dialog>
  )
}

export default FileUploadModal
