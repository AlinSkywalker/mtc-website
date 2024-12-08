import React from 'react'
import { useFetchRegionDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'

const defaultItem = {
  region_desk: '',
  region_name: '',
}

const validationSchema = Yup.object({
  region_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const RegionDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchRegionDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})
  // console.log('rowModesModel', rowModesModel)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    // console.log('handleSaveNewItem')
    return apiClient.put('/api/regionDictionary', {
      desc: data.region_desk,
      name: data.region_name,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/regionDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
    })
  }

  const handleSaveEditedItem = (data) => {
    // console.log('handleSaveEditedItem')
    return apiClient.post(`/api/regionDictionary/${data.id}`, {
      desc: data.region_desk,
      name: data.region_name,
    })
  }

  const columns = [
    {
      field: 'region_name',
      headerName: 'Название',
      width: 350,
      editable: true,
    },
    { field: 'region_desk', headerName: 'Описание', width: 450, editable: true },
  ]

  const fieldToFocus = 'region_name'
  const columnVisibilityModel = {}

  const processRowUpdate = (newRow) => {
    console.log('processRowUpdate', newRow)
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
      const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
      handleSave(newRow)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
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

  // if (isLoading) return null
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
