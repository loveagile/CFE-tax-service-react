import axios from 'axios'

import {
  BASE_URL,
  EMAIL_SERVER,
  YOUR_SERVICE_ID,
  YOUR_TEMPLATE_ID,
  YOUR_PUBLIC_KEY,
} from '../config'

export const login = (user) => axios.post(`${BASE_URL}/auth/login`, user)

export const forgotPassword = ({ type, param }) => {
  return axios.post(`${BASE_URL}/auth/forgotpassword`, { type, param })
}

export const getResetToken = (token) => {
  return axios.get(`${BASE_URL}/auth/reset/${token}`)
}

export const updatePassword = (id, password) => {
  return axios.put(`${BASE_URL}/auth/updatepassword/${id}`, { password })
}

export const sendEmail = (data) => {
  return axios.post(EMAIL_SERVER, {
    lib_version: '3.10.0',
    service_id: YOUR_SERVICE_ID,
    template_id: YOUR_TEMPLATE_ID,
    user_id: YOUR_PUBLIC_KEY,
    template_params: {
      email: data?.email,
      firstname: data?.lastname,
      lastname: data?.lastname,
      username: data?.username,
    },
  })
}

export const getCurrentUser = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/auth/currentuser`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getProfile = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createProfile = (profile) => {
  const token = localStorage.getItem('token')
  return axios.post(`${BASE_URL}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getDependents = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/dependents`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createDependent = (dependent) => {
  const token = localStorage.getItem('token')
  return axios.post(`${BASE_URL}/dependents`, dependent, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateDependent = (dependent) => {
  const token = localStorage.getItem('token')
  return axios.put(`${BASE_URL}/dependents/${dependent._id}`, dependent, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteDependent = (dependent) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${BASE_URL}/dependents/${dependent._id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateAccount = (account) => {
  const token = localStorage.getItem('token')
  return axios.put(`${BASE_URL}/auth/account`, account, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getClients = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createClient = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${BASE_URL}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateClient = (data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${BASE_URL}/users/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteClient = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getCategories = (id) => {
  const token = localStorage.getItem('token')
  if (id) {
    return axios.get(`${BASE_URL}/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } else {
    return axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}

export const createCategory = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${BASE_URL}/categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateCategory = (data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${BASE_URL}/categories/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteCategory = (data) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${BASE_URL}/categories/${data._id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const getFiles = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const uploadFiles = (formData) => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
  return axios.post(`${BASE_URL}/files`, formData, config)
}

export const deleteFile = (data) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${BASE_URL}/files/${data._id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const downloadFile = (file) => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${BASE_URL}/files/download/${file.name}`, config)
}

export const getMessages = (receiver) => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  if (receiver) {
    return axios.get(`${BASE_URL}/messages/${receiver}`, config)
  } else {
    return axios.get(`${BASE_URL}/messages/`, config)
  }
}
