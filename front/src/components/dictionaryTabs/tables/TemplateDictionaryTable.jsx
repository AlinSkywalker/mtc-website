import React from 'react'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import { multilineColumnType } from '../../dataGridCell/GridEditMultilineCell'
import { useFetchEquipmentTemplate } from '../../../queries/equipment'

const defaultItem = {
  template_name: '',
  template_desc: '',
}

const validationSchema = Yup.object({
  template_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const TemplateDictionaryTable = ({ onRowSelectionModelChange }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEquipmentTemplate()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/dictionary/equipmentTemplate', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/dictionary/equipmentTemplate/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['equipmentTemplateDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/dictionary/equipmentTemplate/${id}`, postedData)
  }, [])

  const columns = [
    { field: 'template_name', headerName: 'Название', width: 250, editable: true },
    {
      field: 'template_desc',
      headerName: 'Описание',
      width: 350,
      editable: true,
      ...multilineColumnType,
    },
  ]

  const fieldToFocus = 'template_name'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['equipmentTemplateDictionary'] })
  }

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
      height={600}
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
