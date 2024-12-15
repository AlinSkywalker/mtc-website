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
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
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

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
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
