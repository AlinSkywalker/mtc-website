import React from 'react'
import {
  useFetchEventBaseHouseRoomMemberList,
  useFetchMemberForEventRoom,
} from '../../../queries/eventBase'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../../dataGridCell/SelectEditInputCell'

const defaultItem = {
  basenom_name: '',
  date_st: '',
  date_f: '',
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
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
    return apiClient.put(`/api/eventList/${eventId}/baseHouseRoom/${selectedBaseRoom}/member`, {
      ...postedData,
      base_per: selectedBaseRoom,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient
      .delete(`/api/eventList/${eventId}/baseHouseRoom/${selectedBaseRoom}/member/${id}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['event', eventId, 'baseHouseRoomMember', selectedBaseRoom],
        })
      })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(
      `/api/eventList/${eventId}/baseHouseRoom/${selectedBaseRoom}/member/${id}`,
      postedData,
    )
  }, [])

  const renderSelectEditCell = (params) => {
    const hookParams = {
      eventId,
      selectedBaseRoom,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='event_per'
        hook={useFetchMemberForEventRoom}
        hookParams={hookParams}
      // secondarySource='basefd_name'
      />
    )
  }

  const columns = [
    {
      field: 'fio',
      headerName: 'Участник',
      width: 200,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    { field: 'per_desk', headerName: 'Примечание', width: 150, editable: true },
    { field: 'event_per', headerName: 'event_per', width: 0, editable: true },
  ]

  const fieldToFocus = 'fio'
  const columnVisibilityModel = {
    event_per: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'baseHouseRoomMember', selectedBaseRoom],
    })
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
      addButtonDisabled={!selectedBaseRoom}
    />
  )
}
