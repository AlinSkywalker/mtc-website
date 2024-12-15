import React from 'react'
import { useGridApiContext, GRID_DATE_COL_DEF } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import { format, formatISO, parseISO } from 'date-fns'

export const dateColumnType = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />
  },
  valueFormatter: (value) => {
    if (value) {
      // console.log(value)
      return format(value, 'dd.MM.yyyy')
    }
    return null
  },
}
const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
})

function WrappedGridEditDateInput(props) {
  const { InputProps, focused, ...other } = props
  return <GridEditDateInput fullWidth {...InputProps} {...other} />
}

function GridEditDateCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext()

  const Component = DatePicker
  // console.log('GridEditDateCell', value)
  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: formatISO(newValue, { representation: 'date' }),
    })
  }
  const pickerValue = parseISO(value)
  return (
    <Component
      value={pickerValue}
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
    />
  )
}
