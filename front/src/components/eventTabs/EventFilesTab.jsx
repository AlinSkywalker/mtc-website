import React from 'react'
import { useFetchEventFileList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { fileColumnType } from '../dataGridCell/GridEditFileCell'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GridEditInputCell } from '@mui/x-data-grid'

const defaultItem = {
  event_file: '',
}

const validationSchema = Yup.object({
  // event_file: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventFilesTab = ({ eventId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventFileList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  const navigate = useNavigate()

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const formData = new FormData()
    formData.append('event_file', data.event_file?.[0])
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
      field: 'event_file',
      headerName: 'Файл',
      width: 250,
      editable: true,
      ...fileColumnType,
    },
    // {
    //   field: 'event_file',
    //   headerName: 'Файл',
    //   width: 0,
    //   editable: true,
    // },
  ]
  const fieldToFocus = 'event_file'
  const columnVisibilityModel = {
    // event_file: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'files'] })
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
      isCellEditable={(params) =>
        params.field !== 'fio' || (params.row.isNew && params.field == 'fio')
      }
    />
  )
}
