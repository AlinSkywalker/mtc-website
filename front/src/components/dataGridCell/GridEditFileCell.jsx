import React from 'react'
import { useGridApiContext } from '@mui/x-data-grid'
import { Link, Grid2 as Grid } from '@mui/material'
import apiClient from '../../api/api'

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
//, { responseType: 'blob' }
const handleDownloadFile = (id) => async () => {
  const response = await apiClient.get(`/api/eventList/:eventId/files/${id}`, {
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
function GridFileCell({ value, id }) {
  // return (
  //   <form action={`/api/eventList/:eventId/files/${id}`} method='get'>
  //     <button type='submit'>{value}</button>
  //   </form>
  // )
  return <Link onClick={handleDownloadFile(id)}>{value}</Link>
}

function GridEditFileCell({ id, field, value }) {
  const apiRef = useGridApiContext()

  const handleFileInput = (event, newValue) => {
    const files = event.currentTarget.files
    // console.log('files', files)
    apiRef.current.setEditCellValue({ id, field: 'file', value: files })
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
