import React from 'react'
import {
  useFetchEventBaseHouseRoomMemberList,
  useFetchMemberForEventRoom,
} from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'

const defaultItem = {
  basenom_name: '',
  date_st: '',
  date_f: '',
}

const validationSchema = Yup.object({
  basenom_name: Yup.string().required('Поле обязательно для заполнения'),
  date_st: Yup.string().required('Поле обязательно для заполнения'),
  date_f: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventBaseHouseRoomMemberTable = ({ eventId, selectedBaseRoom }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventBaseHouseRoomMemberList(eventId, selectedBaseRoom)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/baseHouseRoomMember`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/baseHouseRoomMember/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'baseHouseRoomMember'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/baseHouseRoomMember/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    const hookParams = {
      eventId,
      selectedBaseRoom,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='member'
        nameField='basefd'
        hook={useFetchMemberForEventRoom}
        hookParams={hookParams}
        secondarySource='basefd_name'
      />
    )
  }

  const columns = [
    {
      field: 'basenom_name',
      headerName: 'Номер',
      width: 200,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    { field: 'date_st', ...dateColumnType, headerName: 'Начало', width: 120, editable: true },
    {
      field: 'date_f',
      ...dateColumnType,
      headerName: 'Конец',
      width: 120,
      editable: true,
    },

    { field: 'basefd', headerName: 'basefd', width: 0, editable: true },
  ]

  const fieldToFocus = 'basenom_name'
  const columnVisibilityModel = {
    basefd: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'baseHouseRoomMember'] })
  }
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
    />
  )
}
