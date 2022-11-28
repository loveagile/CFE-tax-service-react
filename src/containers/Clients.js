import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Button,
  tableCellClasses,
} from '@mui/material'
import { Edit, Delete, PersonAdd } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles'

import { deleteClient, getClients } from '../api/apiCaller'
import UserModal from '../components/UserModal'
import ConfirmModal from '../components/ConfirmModal'
import { CurrentUserContext } from '../contexts/currentUser'
import { ClientContext } from '../contexts/clients'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const columns = [
  { id: 'name', label: 'Name', minWidth: 100, align: 'center' },
  { id: 'username', label: 'Username', minWidth: 100, align: 'center' },
  { id: 'email', label: 'Email', minWidth: 100, align: 'center' },
  { id: 'activated', label: 'Activated', minWidth: 50, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
]

const initUser = {
  firstname: '',
  lastname: '',
  business: '',
  email: '',
  IDNumber: '',
  username: '',
}

const Clients = () => {
  const [page, setPage] = useState(0)
  const [user, setUser] = useState(initUser)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [modal, setModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [type, setType] = useState('')
  const [render, setRender] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const value = useContext(CurrentUserContext)
  const clientValue = useContext(ClientContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (value?.currentUser?.role !== 'admin') {
      navigate('/files')
    } else {
      getClients()
        .then((data) => {
          clientValue.setClients(data?.data?.users)
        })
        .catch((err) => {})
    }
  }, [render])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  const handleDelete = (id) => {
    deleteClient(id)
      .then(() => {
        setRender(!render)
        toast.success('Deleted the user successfully.')
      })
      .catch((error) => {
        toast.error('Deleting the user was failed')
      })
    setConfirm(false)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '50px' }}>
      <Button
        variant='contained'
        onClick={() => {
          setUser(initUser)
          setModal(true)
          setType('add')
        }}
        sx={{ marginBottom: '15px' }}
        startIcon={<PersonAdd />}
      >
        Add Client
      </Button>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns &&
                columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clientValue?.clients &&
              clientValue?.clients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  return (
                    <TableRow
                      hover
                      xs={{ cursor: 'pointer' }}
                      role='checkbox'
                      tabIndex={-1}
                      key={user._id}
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/files/${user._id}`)
                      }}
                    >
                      {columns.map((column) => {
                        const values = {
                          name: user?.firstname + ' ' + user?.lastname,
                          username: user?.username,
                          email: user?.email,
                          activated: user?.activated ? 'Yes' : 'No',
                        }
                        if (column.id !== 'actions') {
                          return (
                            <StyledTableCell
                              key={column.id}
                              align={column.align}
                            >
                              {values[column.id]}
                            </StyledTableCell>
                          )
                        } else {
                          return (
                            <StyledTableCell
                              key={column.id}
                              align={column.align}
                            >
                              <IconButton
                                aria-label='edit'
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setUser(user)
                                  setType('edit')
                                  setModal(true)
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                aria-label='delete'
                                onClick={(event) => {
                                  setDeleteId(user._id)
                                  event.stopPropagation()
                                  setConfirm(true)
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </StyledTableCell>
                          )
                        }
                      })}
                    </TableRow>
                  )
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component='div'
        count={clientValue?.clients?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <UserModal
        open={modal}
        setOpen={setModal}
        user={user}
        type={type}
      ></UserModal>
      <ConfirmModal
        open={confirm}
        setOpen={setConfirm}
        title='Delete a Client'
        content='Do you want to delete a client?'
        handleDelete={() => handleDelete(deleteId)}
      />
    </Paper>
  )
}

export default Clients
