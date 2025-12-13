import React from 'react'
import { useFetchEventManagementStaff } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { useParams } from 'react-router-dom'
import { useFetchMemberList } from '../../queries/member'
import { Toolbar } from '@mui/x-data-grid'
import {
  Button,
  Grid,
} from '@mui/material'
import { SetAllDayManagementStaffDialog } from '../dialogs/SetAllDayManagementStaffDialog'
const defaultItem = {}

const validationSchema = Yup.object({
  ob_fio: Yup.string().required('Поле обязательно для заполнения'),
  st_fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventManagementStuffTab = () => {
  const { id: eventId } = useParams()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventManagementStaff(eventId)
  const [open, setOpen] = React.useState(false)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/eventManagementStuff`, postedData)
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/eventManagementStuff/${data.date}`, postedData)
  }, [])

  const renderSTSelectEditCell = (params) => {
    const hookParams = { possibleRole: 'st' }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='st'
        hook={useFetchMemberList}
        hookParams={hookParams}
      />
    )
  }
  const renderOBSelectEditCell = (params) => {
    const hookParams = { possibleRole: 'ob' }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='ob'
        hook={useFetchMemberList}
        hookParams={hookParams}
      />
    )
  }
  const renderDoctorSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='ob'
        hook={useFetchMemberList}
      />
    )
  }

  const columns = [
    {
      field: 'date',
      ...dateColumnType,
      headerName: 'Дата',
      width: 120,
      editable: false,
    },
    {
      field: 'st_fio',
      headerName: 'Старший тренер',
      width: 300,
      renderEditCell: renderSTSelectEditCell,
      editable: true,
    },
    {
      field: 'ob_fio',
      headerName: 'ОБ',
      width: 300,
      renderEditCell: renderOBSelectEditCell,
      editable: true,
    },
    {
      field: 'doctor_fio',
      headerName: 'Врач',
      width: 300,
      renderEditCell: renderDoctorSelectEditCell,
      editable: true,
    },
    { field: 'st', headerName: 'st', width: 0, editable: true },
    { field: 'ob', headerName: 'ob', width: 0, editable: true },
    { field: 'doctor', headerName: 'doctor', width: 0, editable: true },
  ]
  const fieldToFocus = 'date'
  const columnVisibilityModel = {
    st: false,
    ob: false,
    doctor: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }

  const toolbar = (
    <Toolbar>
      <Grid sx={{ flexGrow: 1 }}>
        <Button color='primary' onClick={() => setOpen(true)}>
          Назначить на все даты
        </Button>
      </Grid>
    </Toolbar>
  )

  if (!eventId) return null

  return (
    <>
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
        addButtonDisabled
        toolbar={toolbar}
      />
      <SetAllDayManagementStaffDialog open={open} setOpen={setOpen} eventId={eventId} />
    </>
  )
}
