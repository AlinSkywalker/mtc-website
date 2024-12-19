import React from 'react'
import { useGridApiContext } from '@mui/x-data-grid'
import { Link } from '@mui/material'

export const fileColumnType = {
  renderCell: (params) => {
    return <GridFileCell {...params} />
  },
  renderEditCell: (params) => {
    return <GridEditFileCell {...params} />
  },
  valueGetter: (value) => {
    return value == 0 ? false : true
  },
}
function GridFileCell({ value }) {
  return <Link>TestText</Link>
}

function GridEditFileCell({ id, field, value }) {
  const apiRef = useGridApiContext()

  const handleFileInput = (event, newValue) => {
    const files = event.currentTarget.files
    console.log('files', files)
    apiRef.current.setEditCellValue({ id, field, value: files })
  }

  return <input type='file' name='file' required onChange={handleFileInput} />
}
