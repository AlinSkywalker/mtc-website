import React from 'react'
import { useGridApiContext } from '@mui/x-data-grid'
import { Link, Grid } from '@mui/material'
import apiClient from '../../api/api'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

export const fileColumnType = {
  renderCell: (params) => {
    return <GridFileCell {...params} />
  },
  renderEditCell: (params) => {
    return <GridEditFileCell {...params} />
  },
  // valueGetter: (value) => {
  //   return value == 0 ? false : true
  // },
}

const handleDownloadFile = (id, downloadApiPath, filePathField, fileNameField) => async () => {
  const downloadPath = `${downloadApiPath}/${id}?filePathField=${filePathField}&fileNameField=${fileNameField}`
  const response = await apiClient.get(downloadPath, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  let fileName = response.headers['content-disposition'].split("filename*=UTF-8''")[1]
  if (fileName) {
    fileName = decodeURIComponent(fileName)
  } else {
    fileName = response.headers['content-disposition'].split('filename=')[1]
  }
  fileName = fileName.replaceAll('"', '')
  const link = document.createElement('a')
  link.href = url
  // console.log('fileName', fileName)
  link.setAttribute('download', fileName) // Specify the filename here
  document.body.appendChild(link)
  link.click()
}
function GridFileCell({ value, id, colDef }) {
  return (
    <Link
      onClick={handleDownloadFile(
        id,
        colDef.downloadApiPath,
        colDef.filePathField,
        colDef.fileNameField,
      )}
    >
      {value}
    </Link>
  )
}

function GridEditFileCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext()

  const handleFileInput = (event, newValue) => {
    const files = event.currentTarget.files
    // console.log('files', files)
    apiRef.current.setEditCellValue({ id, field: colDef.fileCol, value: files })
  }
  const handleClearFile = () => {
    apiRef.current.setEditCellValue({ id, field: colDef.fileCol, value: '' })
    apiRef.current.setEditCellValue({ id, field, value: '' })
  }
  if (value) {
    return (
      <Grid container alignItems={'center'}>
        <Link
          onClick={handleDownloadFile(
            id,
            colDef.downloadApiPath,
            colDef.filePathField,
            colDef.fileNameField,
          )}
        >
          {value}
        </Link>
        <IconButton aria-label='delete' onClick={handleClearFile}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    )
  }
  return (
    <Grid container alignItems={'center'}>
      <input
        type='file'
        name='file'
        onChange={handleFileInput}
        accept='.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx'
      />
    </Grid>
  )
}
