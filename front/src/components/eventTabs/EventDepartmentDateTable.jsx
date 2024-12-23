import React from 'react'
import { useFetchEventDepartmentById } from '../../queries/event'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid2'
import './DateTableStyles.css'
import { format, parseISO } from 'date-fns'
import { getDatesInRange } from '../../utils/getDatesInRange'

export const EventDepartmentDateTable = ({
  eventId,
  selectedDepartmentId,
  onRowSelectionModelChange,
}) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([])
  const { isLoading, data } = useFetchEventDepartmentById(eventId, selectedDepartmentId)

  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    setRowSelectionModel([])
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
      valueFormatter: (value) => format(parseISO(value), 'dd.MM.yyyy'),
    },
  ]
  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    const date = rows.find((item) => item.id == newRowSelectionModel[0])?.date
    onRowSelectionModelChange(date)
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
