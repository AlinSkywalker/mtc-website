import React from 'react'
import { useFetchCityDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  name_city: '',
  desc_city: '',
  pred_city: '',
  tel_city: '',
  email: '',
}

export const CityDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchCityDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    apiClient.put('/api/cityDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/cityDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    apiClient.post(`/api/cityDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
    })
  }, [])

  const columns = [
    { field: 'name_city', headerName: 'Название', width: 250, editable: true },
    { field: 'desc_city', headerName: 'Описание', width: 350, editable: true },
    { field: 'pred_city', headerName: 'Представитель', width: 350, editable: true },
    { field: 'tel_city', headerName: 'Телефон представителя', width: 350, editable: true },
    { field: 'email', headerName: 'Почта представителя', width: 350, editable: true },
  ]

  const fieldToFocus = 'city_name'
  const columnVisibilityModel = {}

  const processRowUpdate = (newRow) => {
    //console.log('processRowUpdate')
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    handleSave(newRow)
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  return (
    <DictionaryEditableTable
      rows={rows}
      setRows={setRows}
      rowModesModel={rowModesModel}
      setRowModesModel={setRowModesModel}
      columns={columns}
      processRowUpdate={processRowUpdate}
      fieldToFocus={fieldToFocus}
      columnVisibilityModel={columnVisibilityModel}
      defaultDictionaryItem={defaultDictionaryItem}
      isLoading={isLoading}
      handleDeleteItem={handleDeleteItem}
    />
  )
}
