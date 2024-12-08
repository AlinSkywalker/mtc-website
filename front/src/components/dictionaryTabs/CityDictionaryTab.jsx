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
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/cityDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/cityDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
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

  const processRowUpdate = (newRow) => {
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
      const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
      handleSave(newRow)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ['cityDictionary'] })
          const updatedRow = { ...newRow, isNew: false, error: false }
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
          resultRow = updatedRow
        })
        .catch((e) => {
          // ошибка с бэка - надо как то вывести, и оно видимо не сохранилось
          const errorRow = { ...newRow, error: true }
          setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
          resultRow = errorRow
          throw errorRow
        })
    } catch (e) {
      const errors = e.inner.map((item) => ({ path: item.path, message: item.message }))
      const errorRow = { ...newRow, error: true, errors }
      setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
      resultRow = errorRow
      throw errorRow
    }
    return resultRow
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
