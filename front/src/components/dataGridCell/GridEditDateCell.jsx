import React from 'react'
import { useGridApiContext, GRID_DATE_COL_DEF, GRID_DATETIME_COL_DEF } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
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
      return format(value, 'dd.MM.yyyy')
    }
    return null
  },
}

export const dateTimeColumnType = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />
  },
  valueFormatter: (value) => {
    if (value) {
      return format(value, 'dd.MM.yyyy HH:mm')
    }
    return null
  },
}

// const dateTimeColumnType = {
//   ...GRID_DATETIME_COL_DEF,
//   resizable: false,
//   renderEditCell: (params) => {
//     return <GridEditDateCell {...params} />;
//   },
//   filterOperators: getGridDateOperators(true).map((item) => ({
//     ...item,
//     InputComponent: GridFilterDateInput,
//     InputComponentProps: { showTime: true },
//   })),
//   valueFormatter: (value) => {
//     if (value) {
//       return dateAdapter.format(value, 'keyboardDateTime');
//     }
//     return '';
//   },
// };
const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
})

function WrappedGridEditDateInput(props) {
  const { InputProps, focused, ...other } = props
  return <GridEditDateInput fullWidth {...InputProps} {...other} />
}

function GridEditDateCell({ id, field, value, colDef, row }) {
  const apiRef = useGridApiContext()
  // console.log('colDef', colDef.minDate)
  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker
  const handleChange = (newValue) => {
    // console.log('handleChange', newValue)
    const dateFormat = colDef.type === 'dateTime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
    apiRef.current.setEditCellValue({
      id,
      field,
      value: format(newValue, dateFormat),
    })
  }
  const pickerValue = parseISO(value || '')
  const minDate = colDef.minDate ? new Date(row[colDef.minDate]) : undefined
  // console.log('minDate', minDate)
  return (
    <Component
      value={pickerValue}
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
      minDate={minDate}
    />
  )
}
