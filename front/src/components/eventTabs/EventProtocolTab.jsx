import React from 'react'
import { useFetchEventProtocol } from '../../queries/event'
import Grid from '@mui/material/Grid'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{
          fileName: 'eventProtocol',
          delimiter: ';',
          utf8WithBom: true,
        }}
      />
    </GridToolbarContainer>
  )
}

export const EventProtocolTab = ({ eventId }) => {
  const { isLoading, data } = useFetchEventProtocol(eventId)

  const [rows, setRows] = React.useState(data)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const columns = [
    {
      field: 'id',
      headerName: '№',
      width: 80,
    },
    { field: 'fio', headerName: 'ФИО', width: 350 },
    { field: 'alprazr', headerName: 'сп. разряд', width: 100 },
    { field: 'role', headerName: 'в качестве кого', width: 200 },
    { field: 'sub_name', headerName: 'Субъект РФ', width: 350 },
    { field: 'mount_name', headerName: 'Вершина', width: 350 },
    { field: 'rout_name', headerName: 'Маршрут, согласно КМГВ', width: 350 },
    { field: 'rout_comp', headerName: 'кат сл.', width: 100 },
    { field: 'rout_tip', headerName: 'характер м-та', width: 100 },
    { field: 'group_type', headerName: 'состав группы', width: 100 },
    { field: 'start', headerName: 'дата', width: 100 },
  ]

  if (!eventId) return null
  return (
    <Grid size={12} sx={{ height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        columnHeaderHeight={36}
        rowHeight={42}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </Grid>
  )
}
