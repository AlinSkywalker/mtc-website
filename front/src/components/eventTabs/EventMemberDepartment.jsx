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
  const [seleсtedDepartment, setSelectedDepartment] = React.useState()
  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)
  }

  const { data: membersData } = useFetchEventMemberList(eventId)
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

  const membersColumns = [
    {
      field: 'fio',
      headerName: 'ФИО участника',
      width: 350,
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
          startIcon={<AddIcon />}
          onClick={handelClickAddDepartment}
          disabled={!seleсtedMember || !seleсtedDepartment}
        >
          Добавить в отделение на все даты
        </Button>
      </Grid>
    </Toolbar>
  )
  if (!eventId) return null

  return (
    <Grid container>
      <Grid item size={5} sx={{ height: 600 }}>
        <DataGrid
          rows={membersRows}
          columns={membersColumns}
          columnHeaderHeight={36}
          rowHeight={42}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={rowSelectionModel}
          showToolbar
          slots={{
            toolbar: () => <Toolbar />,
          }}
        />
      </Grid>
      <Grid item size={7}>
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
          height={600}
        />
      </Grid>
    </Grid>
  )
}
