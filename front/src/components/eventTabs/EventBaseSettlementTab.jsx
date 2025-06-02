import React from 'react'

import Grid from '@mui/material/Grid'

import { useParams } from 'react-router-dom'

import { useFetchEventMemberList } from '../../queries/event'
import { DataGrid, Toolbar } from '@mui/x-data-grid'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { format, parseISO } from 'date-fns'
import { EventMemberSettlement } from './EventMemberSettlement'

const emptyRowSelection = {
  type: 'include',
  ids: new Set([0]),
}
export const EventBaseSettlementTab = () => {
  const { id: eventId } = useParams()
  const [seleсtedMember, setSelectedMember] = React.useState()

  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)
  }
  const [rowSelectionModel, setRowSelectionModel] = React.useState(emptyRowSelection)

  const { data: membersData } = useFetchEventMemberList(eventId)
  const someMembersHasNoBase = React.useMemo(() => {
    return membersData?.some((item) => !item.allDaysWithDept)
  }, [membersData])
  const [membersRows, setMembersRows] = React.useState(membersData)

  React.useEffect(() => {
    setMembersRows(membersData)
  }, [membersData])
  const renderMemberFioCell = (params) => {
    // format(parseISO(params.row.eventmemb_dates), 'dd.MM')
    const value = `${params.row.fio} (${format(parseISO(params.row.eventmemb_dates), 'dd.MM')} - ${format(parseISO(params.row.eventmemb_datef), 'dd.MM')})`

    if (!params.row.allDaysWithDept) {
      return (
        <>
          {value}
          <Tooltip title='У участника не указано отделение на некоторые дни'>
            <IconButton sx={{ marginLeft: 1, color: red[500] }}>
              <ErrorIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    } else {
      return value
    }
  }
  const membersColumns = [
    {
      field: 'fio',
      headerName: 'ФИО участника',
      width: 400,
      renderCell: renderMemberFioCell,
    },
  ]


  return (
    <Grid container spacing={1}>
      <Grid size={4}>
        <DataGrid
          rows={membersRows}
          columns={membersColumns}
          columnHeaderHeight={36}
          rowHeight={42}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={rowSelectionModel}
          showToolbar
          slots={{
            toolbar: () => (
              <Toolbar>
                {someMembersHasNoBase ? (
                  <Grid sx={{ flexGrow: 1 }}>
                    <Tooltip title='У некоторых участников не указано проживание на некоторые дни'>
                      <IconButton sx={{ color: red[500] }}>
                        <ErrorIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                ) : (
                  <></>
                )}
              </Toolbar>
            ),
          }}
        />
      </Grid>
      <Grid size={5}>
        <EventMemberSettlement eventId={eventId} seleсtedMember={seleсtedMember} />
      </Grid>
    </Grid>
  )
}
