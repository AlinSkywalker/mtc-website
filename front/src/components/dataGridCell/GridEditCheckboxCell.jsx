import React from 'react'
import { useGridApiContext } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'

export const checkboxColumnType = {
  renderCell: (params) => {
    return <GridCheckboxCell {...params} />
  },
  renderEditCell: (params) => {
    return <GridEditCheckboxCell {...params} />
  },
  valueGetter: (value) => {
    return value == 0 ? false : true
  },
}
function GridCheckboxCell({ value }) {
  return <Checkbox checked={value} disabled />
}

function GridEditCheckboxCell({ id, field, value }) {
  const apiRef = useGridApiContext()

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.checked })
  }

  return <Checkbox checked={value} onChange={handleChange} />
}
