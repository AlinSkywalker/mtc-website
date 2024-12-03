import React from 'react'
import { useFetchRegionDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  region_desk: '',
  region_name: '',
}
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
    apiClient
      .put('/api/regionDictionary', { desc: data.region_desk, name: data.region_name })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
      })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/regionDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
    })
  }

  const handleSaveEditedItem = (data) => {
    // console.log('handleSaveEditedItem')
    apiClient
      .post(`/api/regionDictionary/${data.id}`, {
        desc: data.region_desk,
        name: data.region_name,
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
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
    //console.log('processRowUpdate')
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    handleSave(newRow)
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  // if (isLoading) return null
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
