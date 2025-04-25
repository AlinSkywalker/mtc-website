import React from 'react'
import { useFetchEventDepartmentById } from '../../queries/event'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import './DateTableStyles.css'
import { format, parse } from 'date-fns'
import { getDatesInRange } from '../../utils/getDatesInRange'

const emptyRowSelection = {
  type: 'include',
  ids: new Set([0]),
}

export const EventDepartmentDateTable = ({
  eventId,
  selectedDepartmentId,
  onRowSelectionModelChange,
}) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState(emptyRowSelection)
  const { isLoading, data } = useFetchEventDepartmentById(eventId, selectedDepartmentId)

  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    setRowSelectionModel(emptyRowSelection)
  }, [selectedDepartmentId])

  React.useEffect(() => {
    if (data) {
      const dates = getDatesInRange(new Date(data.depart_dates), new Date(data.depart_datef))
      setRows(dates)
    }
  }, [data])

  const columns = [
    {
      field: 'date',
      headerName: 'Дата',
      width: 120,
    },
  ]

  const handleRowSelectionModelChange = (newRowSelectionModel) => {

    setRowSelectionModel(newRowSelectionModel)
    let newDate = ''
    newRowSelectionModel.ids.forEach(item => {
      newDate = item
    })
    const date = rows.find((item) => item.id == newDate)?.date
    const formattedDate = date ? format(parse(date, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd') : ''
    onRowSelectionModelChange(formattedDate)
  }

  return (
    <Grid item size={12} sx={{ height: 400 }}>
      <DataGrid
        className='departDateTable'
        rows={rows}
        columns={columns}
        loading={isLoading}
        columnHeaderHeight={36}
        rowHeight={42}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={rowSelectionModel}
      />
    </Grid>
  )
}
