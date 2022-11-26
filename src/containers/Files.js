import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Grid,
  Paper,
  Button,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  tableCellClasses,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { CreateNewFolder, FileUpload } from '@mui/icons-material'
import { toast } from 'react-toastify'

import CategoryRow from '../components/CategoryRow'
import FileUploadModal from '../components/FileUploadModal'
import AddFolderModal from '../components/AddFolderModal'
import { CurrentUserContext } from '../contexts/currentUser'
import { CategoriesContext } from '../contexts/categories'
import { getCategories } from '../api/apiCaller'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const Files = (req) => {
  const value = useContext(CurrentUserContext)
  const categoryValue = useContext(CategoriesContext)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [addFolder, setAddFolder] = useState(false)
  const [folder, setFolder] = useState({})
  const [flag, setFlag] = useState(false)
  let id = useParams().id || ''

  if (value?.currentUser?.role !== 'admin' || !id) {
    id = value?.currentUser?._id
  }

  useEffect(() => {
    getCategories(id)
      .then((data) => {
        categoryValue.setFilesByFrom(data?.data?.filesByFrom)
        categoryValue.setFilesByTo(data?.data?.filesByTo)
        const list = data?.data?.filesByFrom.map((category) => {
          return { _id: category._id, name: category.name }
        })
        categoryValue.setCategories(list)
      })
      .catch((err) => {
        toast.error(err.error)
      })
  }, [flag, id])

  return (
    <Box sx={{ width: '100%', overflow: 1, marginTop: '50px' }}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant='contained'
              sx={{ marginBottom: '20px' }}
              startIcon={<CreateNewFolder />}
              onClick={() => setAddFolder(true)}
            >
              Add Folder
            </Button>
            <Typography variant='h5'>To preparer</Typography>
            <Button
              variant='outlined'
              sx={{ marginBottom: '20px' }}
              startIcon={<FileUpload />}
              onClick={() => {
                setFolder({ _id: '', name: '' })
                setUploadOpen(true)
              }}
            >
              Upload
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ height: window.innerHeight - 230, overflowY: 'auto' }}
          >
            <Table stickyHeader aria-label='from download'>
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell>Folder name</StyledTableCell>
                  <StyledTableCell align='center'>
                    Number of files
                  </StyledTableCell>
                  <StyledTableCell align='center'>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryValue?.filesByFrom?.map((file) => (
                  <CategoryRow
                    key={file._id}
                    row={file}
                    setFolder={setFolder}
                    uploadOpen={uploadOpen}
                    setUploadOpen={setUploadOpen}
                    flag={flag}
                    setFlag={setFlag}
                    type='From'
                  />
                ))}
              </TableBody>
            </Table>
            {!categoryValue?.filesByFrom?.length && (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '5px',
                }}
              >
                There aren't any folders.
              </Typography>
            )}
          </TableContainer>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h5'>From preparer</Typography>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              height: window.innerHeight - 230,
              marginTop: '24px',
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader aria-label='from download'>
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell>Folder name</StyledTableCell>
                  <StyledTableCell align='center'>
                    Number of files
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryValue?.filesByTo?.map((file) => (
                  <CategoryRow
                    key={file._id}
                    row={file}
                    uploadOpen={uploadOpen}
                    setFolder={setFolder}
                    setUploadOpen={setUploadOpen}
                    flag={flag}
                    setFlag={setFlag}
                    type='To'
                  />
                ))}
              </TableBody>
            </Table>
            {!categoryValue?.filesByTo?.length && (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '5px',
                }}
              >
                There aren't any folders.
              </Typography>
            )}
          </TableContainer>
        </Grid>
      </Grid>
      <FileUploadModal
        open={uploadOpen}
        setOpen={setUploadOpen}
        folder={folder}
        categories={categoryValue?.categories}
        flag={flag}
        setFlag={setFlag}
      />
      <AddFolderModal open={addFolder} setOpen={setAddFolder} />
    </Box>
  )
}

export default Files
