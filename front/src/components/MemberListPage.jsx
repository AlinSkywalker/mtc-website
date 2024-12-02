import React from 'react'
import Container from '@mui/material/Container'
import { useFetchMemberList } from '../queries/member'
import { DataGrid } from '@mui/x-data-grid'
import { formatDateValue } from '../utils/formatDate'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const MemberListPage = () => {
  const { isLoading, data } = useFetchMemberList()
  const navigate = useNavigate()

  const handleClickName = (id) => () => {
    navigate(`/admin/member/${id}`)
  }
  // console.log('event_name', data?.event_name)
  const renderLink = (params) => {
    // console.log(params)
    const link = params.value ?? ''

    return <Link onClick={handleClickName(params.row.id)}>{link}</Link>
  }

  // {
  //   "id": 1,
  //   "fio": "Вещагин Михаил Александрович",
  //   "gender": "М",
  //   "date_birth": "1979-01-18T21:00:00.000Z",
  //   "memb_city": 1,
  //   "tel_1": "+79509632051",
  //   "tel_2": null,
  //   "memb_email": "misha19-01-79@yandex.ru",
  //   "size_cloth": "48",
  //   "size_shoe": "41",
  // }
  const columns = [
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderLink,
    },
    { field: 'gender', headerName: 'Пол', width: 100 },
    {
      field: 'date_birth',
      headerName: 'Дата рождения',
      width: 150,
      valueGetter: (value) => {
        return formatDateValue(value || '', 'dd.MM.yyyy')
      },
    },
    {
      field: 'name_city',
      headerName: 'Город',
      width: 150,
    },
    { field: 'memb_email', headerName: 'Email', width: 150 },
    { field: 'tel_1', headerName: 'Телефон', width: 150 },
  ]

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
