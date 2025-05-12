import React from 'react'
import { useFetchMemberEvent } from '../../queries/member'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'

export const MemberEventTab = ({ memberId }) => {
  const { isLoading, data } = useFetchMemberEvent(memberId)

  const [rows, setRows] = React.useState(data)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const columns = [
    {
      field: 'event_name',
      headerName: 'Название',
      width: 150,
    },
    { field: 'event_desc', headerName: 'Описание', width: 350, editable: true },
    {
      field: 'event_start',

      headerName: 'Дата начала',
      width: 150,
    },
    {
      field: 'event_finish',

      headerName: 'Дата окончания',
      width: 150,
    },
  ]

  if (!memberId) return null
  return (
    <Grid size={12} sx={{ height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        columnHeaderHeight={36}
        rowHeight={42}
      />
    </Grid>
  )
}
