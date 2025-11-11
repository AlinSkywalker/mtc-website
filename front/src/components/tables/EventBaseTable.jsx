import React from 'react'
import { useFetchEventBaseList, useFetchBaseForEvent } from '../../queries/eventBase'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'

const defaultItem = {
  base_name: '',
}

const validationSchema = Yup.object({
  base_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventBaseTable = ({ eventId, readOnly = false }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventBaseList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/eventBase`, { ...postedData, event_m: eventId })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/eventBase/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventBase'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/eventBase/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    const hookParams = {
      eventId,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='baseDictionary'
        nameField='base_m'
        hook={useFetchBaseForEvent}
        hookParams={hookParams}
      />
    )
  }

  const columns = [
    {
      field: 'base_name',
      headerName: 'База',
      width: 200,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    { field: 'base_m', headerName: 'base_m', width: 0, editable: true },
  ]

  const fieldToFocus = 'basenom_name'
  const columnVisibilityModel = {
    base_m: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventBase'] })
  }
  const isRowEditable = (row) => {
    if (row?.isNew) return true
    return false
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
      height={221}
      className='eventBaseTable'
      isRowEditable={isRowEditable}
      readOnly={readOnly}
    />
  )
}
