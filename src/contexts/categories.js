import React, { useState } from 'react'

export const CategoriesContext = React.createContext()

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState()
  const [filesByTo, setFilesByTo] = useState()
  const [filesByFrom, setFilesByFrom] = useState()

  const addFiles = (data) => {
    const newFiles = data
    const list = filesByFrom.map((item) => {
      if (item._id !== newFiles[0].category_id) {
        return item
      } else {
        const fileList = item.filesByFrom
        newFiles.forEach((newFile) => {
          fileList.push(newFile)
        })
        return item
      }
    })
    setFilesByFrom(list)
  }

  const addCategory = (category) => {
    const list = [...categories]
    list.push(category.data.category)
    const fileList = [...filesByFrom]
    fileList.push(category.data.category)
    setCategories(list)
    setFilesByFrom(fileList)
  }

  const updateCategory = (data) => {
    const category = data?.category || { _id: '', name: '' }
    let list = categories.map((item) => {
      if (item._id === category._id) {
        const updated = item
        Object.assign(updated, { name: category.name })
        return updated
      }
      return item
    })
    setCategories(list)
    list = []
    list = filesByFrom.map((item) => {
      if (item._id === category._id) {
        const updated = item
        Object.assign(updated, { name: category.name })
        return updated
      }
      return item
    })
    setFilesByFrom(list)
  }

  const deleteCategory = (category) => {
    let list = categories.map((item) =>
      item._id !== category._id ? item : null
    )
    setCategories(list)
    list = []
    list = filesByFrom.map((item) => (item._id !== category._id ? item : null))
    setFilesByFrom(list)
  }

  return (
    <CategoriesContext.Provider
      value={{
        filesByTo,
        setFilesByTo,
        filesByFrom,
        setFilesByFrom,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        setCategories,
        addFiles,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
