import React from 'react'
import { useFetchEventDepartmentMemberList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchEventMemberListForDepartment } from '../../queries/event'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { Grid2 } from '@mui/material'

const defaultItem = {
  member_fio: '',
  membd_memb: '',
}

const validationSchema = Yup.object({
  member_fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventDepartmentMemberTable = ({ eventId, selectedDepartmentId, selectedDate }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventDepartmentMemberList(
    eventId,
    selectedDepartmentId,
    selectedDate,
  )

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    const apiPath = selectedDate
      ? `/api/eventList/${eventId}/department/${selectedDepartmentId}/member?selectedDate=${selectedDate}`
      : `/api/eventList/${eventId}/department/${selectedDepartmentId}/member`
    return apiClient.put(apiPath, postedData)
  }

  const handleDeleteItem = (id) => () => {
    const apiPath = selectedDate
      ? `/api/eventList/${eventId}/department/${selectedDepartmentId}/member/${id}?selectedDate=${selectedDate}`
      : `/api/eventList/${eventId}/department/${selectedDepartmentId}/member/${id}`
    return apiClient.delete(apiPath).then((res) => {
      queryClient.invalidateQueries({
        queryKey: ['event', eventId, 'department', selectedDepartmentId, 'member', selectedDate],
      })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/department/${id}`, postedData)
  }, [])

  const renderMemberSelectEditCell = (params) => {
    // console.log('params', params)
    const hookParams = {
      eventId,
      departmentId: selectedDepartmentId,
      selectedDate,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='membd_memb'
        hook={useFetchEventMemberListForDepartment}
        hookParams={hookParams}
      />
    )
  }
  const isRowEditable = (row) => {
    if (row?.isNew) return true
    return false
  }

  const columns = [
    {
      field: 'member_fio',
      headerName: 'ФИО участника',
      width: 250,
      renderEditCell: renderMemberSelectEditCell,
      editable: true,
    },
    { field: 'membd_memb', headerName: 'membd_memb', width: 0, editable: true },
  ]

  const fieldToFocus = 'member_fio'
  const columnVisibilityModel = {
    membd_memb: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'department', selectedDepartmentId, 'member', selectedDate],
    })
  }
  const addButtonLabel = selectedDate ? `Добавить на ${selectedDate}` : 'Добавить на все даты'

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
      handleDeleteItem={handleDeleteItem}
      addButtonDisabled={!selectedDepartmentId}
      addButtonLabel={addButtonLabel}
      isRowEditable={isRowEditable}
      isCellEditable={(params) =>
        params.field !== 'member_fio' || (params.row.isNew && params.field == 'member_fio')
      }
    />
  )
}
