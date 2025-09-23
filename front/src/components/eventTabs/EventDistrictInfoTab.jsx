import React from 'react'
import { useFetchEventStatistics } from '../../queries/event'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import { useParams } from 'react-router-dom'

export const EventDistrictInfoTab = () => {
  const { id: eventId } = useParams()
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
    <Grid size={12} sx={{ height: `calc(100vh - 150px)` }}>
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
