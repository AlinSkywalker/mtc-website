import React from 'react'
import Container from '@mui/material/Container'
import { useFetchEventList } from '../queries/event'
import { DataGrid } from '@mui/x-data-grid'
import { formatDateValue } from '../utils/formatDate'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const EventListPage = () => {
  const { isLoading, data } = useFetchEventList()
  const navigate = useNavigate()

  const handleClickName = (id) => () => {
    navigate(`/admin/event/${id}`)
  }
  console.log('event_name', data?.event_name)
  const renderLink = (params) => {
    // console.log(params)
    const link = params.value ?? ''

    return <Link onClick={handleClickName(params.row.id)}>{link}</Link>
  }
  const columns = [
    {
      field: 'event_name',
      headerName: 'Название',
      width: 150,
      renderCell: renderLink,
    },
    { field: 'event_desc', headerName: 'Описание', width: 350 },
    {
      field: 'event_start',
      headerName: 'Дата начала',
      width: 150,
      valueGetter: (value) => {
        return formatDateValue(value, 'dd.MM.yyyy')
      },
    },
    {
      field: 'event_finish',
      headerName: 'Дата окончания',
      width: 150,
      valueGetter: (value) => {
        return formatDateValue(value, 'dd.MM.yyyy')
      },
    },
    { field: 'base_name', headerName: 'Место проведения', width: 150 },
    { field: 'st_fio', headerName: 'Старший тренер', width: 150 },
    { field: 'ob_fio', headerName: 'ОБ', width: 150 },
  ]

  // {
  //   "id": 1,
  //   "event_name": "Левак",
  //   "event_base": 1,
  //   "event_start": "2025-03-08T21:00:00.000Z",
  //   "event_finish": "2025-04-05T21:00:00.000Z",
  //   "event_st": 1,
  //   "event_ob": 2,
  //   "event_desc": "Пример"
  // }

  if (isLoading) return null
  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' }, overflowX: 'scroll' }}
    >
      <DataGrid rows={data} columns={columns} editMode='row' />
    </Container>
  )
}
