import React from 'react'
import { useFetchContractorByBaseIdDictionaryList } from '../../queries/dictionary'
import { DataGrid } from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'

export const EventContractorTab = ({ baseId }) => {
  const { isLoading, data } = useFetchContractorByBaseIdDictionaryList(baseId)

  const [rows, setRows] = React.useState(data)
  // console.log('baseId', baseId)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const columns = [
    { field: 'cont_fio', headerName: 'ФИО', width: 350 },
    { field: 'cont_desc', headerName: 'Описание', width: 350 },
    {
      field: 'cont_zan',
      headerName: 'Занятие',
      width: 150,
    },
    { field: 'cont_email', headerName: 'Email', width: 150 },
    { field: 'cont_tel1', headerName: 'Телефон 1', width: 150 },
    { field: 'cont_tel2', headerName: 'Телефон 2', width: 150 },
    { field: 'cont_tel3', headerName: 'Телефон 3', width: 150 },
  ]

  return (
    <Grid2 item size={12} sx={{ height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        columnHeaderHeight={36}
        rowHeight={42}
      />
    </Grid2>
  )
}
