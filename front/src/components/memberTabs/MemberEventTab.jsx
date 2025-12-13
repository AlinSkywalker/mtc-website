import React from 'react'
import { useFetchMemberEvent } from '../../queries/member'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import { useIsMobile } from '../../hooks/useIsMobile'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { MobileMemberEventTab } from './mobileTables/MobileMemberEventTab'

export const MemberEventTab = ({ memberId }) => {
  const isMobile = useIsMobile()
  const { isLoading, data } = useFetchMemberEvent(memberId)
  const navigate = useNavigate()

  const [rows, setRows] = React.useState(data)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleClickName = (id) => () => {
    const link = `/crm/event/${id}`
    navigate(link)
  }
  const renderLink = (params) => {
    const link = params.value ?? ''
    return (
      <Link onClick={handleClickName(params.row.id)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }
  const columns = [
    {
      field: 'event_name',
      headerName: 'Название',
      width: 150,
      renderCell: renderLink,
    },
    { field: 'event_desc', headerName: 'Описание', width: 350, editable: true },
    {
      field: 'event_start',
      headerName: 'Дата начала',
      width: 150,
      ...dateColumnType,
    },
    {
      field: 'event_finish',

      headerName: 'Дата окончания',
      width: 150,
      ...dateColumnType,
    },
  ]

  if (!memberId) return null
  if (isMobile) return <MobileMemberEventTab isLoading={isLoading} data={data} />

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
