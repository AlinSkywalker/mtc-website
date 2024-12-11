import React from 'react'
import { useFetchEventSmenaList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
const defaultItem = {
  smena_tip: '',
  smena_name: '',
  smena_dates: '',
  smena_datef: '',
}

const validationSchema = Yup.object({
  smena_tip: Yup.string().required('Поле обязательно для заполнения'),
  smena_name: Yup.string().required('Поле обязательно для заполнения'),
  smena_dates: Yup.string().required('Поле обязательно для заполнения'),
  smena_datef: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventSmenaTab = ({ eventId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventSmenaList(eventId)

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/smena`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/smena/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'smena'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/smena/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'smena_tip',
      headerName: 'Тип',
      width: 250,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['НП', 'СП', 'СС', 'СМ'],
    },
    { field: 'smena_name', headerName: 'Название', width: 350, editable: true },
    { field: 'smena_dates', ...dateColumnType, headerName: 'Старт', width: 150, editable: true },
    {
      field: 'smena_datef',
      ...dateColumnType,
      headerName: 'Финиш',
      width: 150,
      editable: true,
    },
  ]

  const fieldToFocus = 'smena_tip'
  const columnVisibilityModel = {}
  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'smena'] })
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
