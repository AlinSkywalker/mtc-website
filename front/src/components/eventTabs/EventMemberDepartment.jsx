import React from 'react'
import { useFetchEventMemberDepartmentList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import { useFetchEventDepartmentListForMember, useFetchEventMemberList } from '../../queries/event'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import Grid from '@mui/material/Grid'
import { DataGrid, Toolbar } from '@mui/x-data-grid'
import { Button, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'

const defaultItem = {
  member_fio: '',
  membd_memb: '',
}
const emptyRowSelection = {
  type: 'include',
  ids: new Set([0]),
}

export const EventMemberDepartment = ({ eventId }) => {
  const queryClient = useQueryClient()

  const [rowSelectionModel, setRowSelectionModel] = React.useState(emptyRowSelection)
  const [seleсtedMember, setSelectedMember] = React.useState()
  const [seleсtedDepartment, setSelectedDepartment] = React.useState('')
  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)
  }

  const { data: membersData } = useFetchEventMemberList(eventId)
  const someMembersHasNoDepartment = React.useMemo(() => {
    return membersData?.some((item) => !item.allDaysWithDept)
  }, [membersData])
  const [membersRows, setMembersRows] = React.useState(membersData)

  React.useEffect(() => {
    setMembersRows(membersData)
  }, [membersData])

  const { isLoading, data } = useFetchEventMemberDepartmentList({
    eventId,
    memberId: seleсtedMember,
  })

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const { data: departmentForMemberData } = useFetchEventDepartmentListForMember({
    eventId,
    memberId: seleсtedMember,
  })

  const handleSaveEditedItem = React.useCallback(
    (data) => {
      const { id, isNew, ...postedData } = data
      return apiClient.post(
        `/api/eventList/${eventId}/member/${seleсtedMember}/departmentForDate`,
        postedData,
      )
    },
    [seleсtedMember],
  )

  const renderDepartmentSelectEditCell = (params) => {
    const hookParams = {
      eventId,
      memberId: seleсtedMember,
      selectedDate: params.row.membd_date,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='department'
        nameField='membd_dep'
        hook={useFetchEventDepartmentListForMember}
        hookParams={hookParams}
        secondarySource='date'
      />
    )
  }

  const columns = [
    {
      field: 'membd_date',
      headerName: 'Дата',
      width: 250,
    },
    {
      field: 'department',
      headerName: 'Отделение',
      width: 300,
      renderEditCell: renderDepartmentSelectEditCell,
      editable: true,
    },
    { field: 'membd_dep', headerName: 'membd_dep', width: 0, editable: true },
    { field: 'existedDept', headerName: 'existedDept', width: 0, editable: true },
  ]

  const fieldToFocus = 'member_fio'
  const columnVisibilityModel = {
    membd_dep: false,
    existedDept: false,
  }

  const renderMemberFioCell = (params) => {
    if (!params.row.allDaysWithDept) {
      return (
        <>
          {params.row.fio}
          <Tooltip title='У участника не указано отделение на некоторые дни'>
            <IconButton sx={{ marginLeft: 1, color: red[500] }}>
              <ErrorIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    } else {
      return params.row.fio
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

  const processRowUpdate = async (newRow) => {
    await handleSaveEditedItem(newRow)
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'member', seleсtedMember, 'departmentByDate'],
    })
  }

  const handelClickAddDepartment = React.useCallback(async () => {
    const postedData = {
      departmentId: seleсtedDepartment,
    }

    await apiClient.post(
      `/api/eventList/${eventId}/member/${seleсtedMember}/departmentForAllDates`,
      postedData,
    )
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'member', seleсtedMember, 'departmentByDate'],
    })
  }, [seleсtedMember, seleсtedDepartment])

  const handleChangeDepartmentSelect = (event) => {
    setSelectedDepartment(event.target.value)
  }

  const toolbar = (
    <Toolbar>
      <Grid sx={{ flexGrow: 1 }}>
        <Select
          sx={{ width: 300 }}
          onChange={handleChangeDepartmentSelect}
          value={seleсtedDepartment}
        >
          {departmentForMemberData?.map((item, index) => (
            <MenuItem
              key={index}
              value={item.id}
            >{`${item.depart_tip} ${item.depart_name} (${item.depart_dates} - ${item.depart_datef})`}</MenuItem>
          ))}
        </Select>
        <Button
          color='primary'
          startIcon={seleсtedDepartment ? <AddIcon /> : <></>}
          onClick={handelClickAddDepartment}
          disabled={!seleсtedMember}
        >
          {seleсtedDepartment ? 'Добавить в отделение на все даты' : 'Сбросить отделения'}
        </Button>
      </Grid>
    </Toolbar>
  )
  if (!eventId) return null

  return (
    <Grid container>
      <Grid size={5} sx={{ height: `calc(100vh - 150px)` }}>
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
                {someMembersHasNoDepartment ? (
                  <Grid sx={{ flexGrow: 1 }}>
                    <Tooltip title='У некоторых участников не указано отделение на некоторые дни'>
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
      <Grid size={7} >
        <EditableTable
          rows={rows}
          setRows={setRows}
          rowModesModel={rowModesModel}
          setRowModesModel={setRowModesModel}
          columns={columns}
          processRowUpdate={processRowUpdate}
          fieldToFocus={fieldToFocus}
          columnVisibilityModel={columnVisibilityModel}
          defaultItem={defaultItem}
          isLoading={isLoading}
          toolbar={toolbar}
          isCellEditable={(params) => params.field !== 'membd_date'}
        />
      </Grid>
    </Grid>
  )
}
