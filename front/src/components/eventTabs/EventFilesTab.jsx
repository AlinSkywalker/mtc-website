import React from 'react'
import { useFetchEventFileList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { fileColumnType } from '../dataGridCell/GridEditFileCell'
import { useParams } from 'react-router-dom'

const defaultItem = {
  event_file: '',
  file_desc: '',
}

const validationSchema = Yup.object({
  // event_file: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventFilesTab = () => {
  const { id: eventId } = useParams()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventFileList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const formData = new FormData()
    formData.append('event_file', data.file?.[0])
    formData.append('file_desc', data.file_desc)
    return apiClient.put(`/api/eventList/${eventId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/files/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'files'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/files/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'file_name',
      headerName: 'Файл',
      width: 250,
      editable: true,
      downloadApiPath: `/api/eventList/${eventId}/files`,
      fileCol: 'file',
      ...fileColumnType,
    },
    {
      field: 'file',
      headerName: 'Файл',
      width: 0,
      editable: true,
    },
    {
      field: 'file_desc',
      headerName: 'Описание',
      width: 300,
      editable: true,
    },
  ]
  const fieldToFocus = 'file_name'
  const columnVisibilityModel = {
    file: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'files'] })
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
      isRowEditable={isRowEditable}
      isCellEditable={(params) =>
        params.field !== 'file_name' || (params.row.isNew && params.field == 'file_name')
      }
    />
  )
}
