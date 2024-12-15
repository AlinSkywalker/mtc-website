import React from 'react'
import { useFetchCityDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'

const defaultItem = {
  name_city: '',
  desc_city: '',
  pred_city: '',
  tel_city: '',
  email: '',
}

const validationSchema = Yup.object({
  name_city: Yup.string().required('Поле обязательно для заполнения'),
})

export const CityDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchCityDictionaryList()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/cityDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/cityDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/cityDictionary/${id}`, postedData)
  }, [])

  const columns = [
    { field: 'name_city', headerName: 'Название', width: 250, editable: true },
    { field: 'desc_city', headerName: 'Описание', width: 350, editable: true },
    { field: 'pred_city', headerName: 'Представитель', width: 350, editable: true },
    { field: 'tel_city', headerName: 'Телефон', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 150, editable: true },
  ]

  const fieldToFocus = 'city_name'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
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
    />
  )
}
