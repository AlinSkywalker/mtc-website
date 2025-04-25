import React from 'react'
import { useFetchEventStatistics } from '../../queries/event'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'

export const EventStatisticsTab = ({ eventId }) => {
  const { isLoading, data } = useFetchEventStatistics(eventId)

  const [rows, setRows] = React.useState(data)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const columns = [
    {
      field: 'statistics',
      headerName: 'Статистика',
      width: 250,
    },
    { field: 'result', headerName: 'Значение', width: 350 },
  ]

  if (!eventId) return null
  return (
    <Grid item size={12} sx={{ height: 400 }}>
      <DataGrid
        className='departDateTable'
        rows={rows}
        columns={columns}
        loading={isLoading}
        columnHeaderHeight={36}
        rowHeight={42}
      />
    </Grid>
  )
}
