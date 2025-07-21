import React from 'react'
import { useFetchEventInstructionLog } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'

const defaultItem = {}

const validationSchema = Yup.object({
  ob_fio: Yup.string().required('Поле обязательно для заполнения'),
  st_fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventInstructionLogTab = () => {
  const { id: eventId } = useParams()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventInstructionLog(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/evenInstructionLog`, postedData)
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/eventInstructionLog/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'date',
      ...dateColumnType,
      headerName: 'Дата',
      width: 120,
      editable: false,
    },
    {
      field: 'instruction',
      headerName: 'Запись',
      width: 900,
      editable: true,
    },
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
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventInstructionLog'] })
  }

  const handleGenerateLog = async () => {
    await apiClient.put(`/api/eventList/${eventId}/generateEventInstructionLog/`)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventInstructionLog'] })
  }
  const generateLogButton = (
    <Button onClick={handleGenerateLog}>Сформировать книгу распоряжений</Button>
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
      additionalButton={generateLogButton}
    />
  )
}
