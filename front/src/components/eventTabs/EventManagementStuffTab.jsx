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
import { Button, Grid } from '@mui/material'

const defaultItem = {}

const validationSchema = Yup.object({
  // cont_fio: Yup.string().required('Поле обязательно для заполнения'),
  // tarif: Yup.string().required('Поле обязательно для заполнения'),
  // count: Yup.string().required('Поле обязательно для заполнения'),
  // transfer: Yup.string().required('Поле обязательно для заполнения'),
  // residence: Yup.string().required('Поле обязательно для заполнения'),
  // service_type: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventManagementStuffTab = () => {
  const { id: eventId } = useParams()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventManagementStaff(eventId)

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

  const columns = [
    {
      field: 'date',
      ...dateColumnType,
      headerName: 'Начало',
      width: 120,
      editable: false,
    },
    {
      field: 'st_fio',
      headerName: 'Старший тренер',
      width: 150,
      renderEditCell: renderSTSelectEditCell,
      editable: true,
    },
    {
      field: 'ob_fio',
      headerName: 'ОБ',
      width: 150,
      renderEditCell: renderOBSelectEditCell,
      editable: true,
    },
    { field: 'st', headerName: 'st', width: 0, editable: true },
    { field: 'ob', headerName: 'ob', width: 0, editable: true },
  ]
  const fieldToFocus = 'cont_fio'
  const columnVisibilityModel = {
    st: false,
    ob: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }

  const handelClickAddStaff = async () => {
    await apiClient.put(`/api/eventList/${eventId}/eventManagementStuffFromEvent/`)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }
  const toolbar = (
    <Toolbar>
      <Grid sx={{ flexGrow: 1 }}>
        <Button color='primary' onClick={handelClickAddStaff}>
          Назначить ОБ И СТ на все даты
        </Button>
      </Grid>
    </Toolbar>
  )
  if (!eventId) return null
  return (
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
  )
}
