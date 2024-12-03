import React from 'react'
import { useFetchContractorDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  cont_fio: '',
  cont_desc: '',
  cont_email: '',
  cont_tel3: '',
  cont_tel2: '',
  cont_tel1: '',
}

export const ContractorDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchContractorDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    apiClient.put('/api/contractorDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/contractorDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    apiClient.post(`/api/contractorDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }, [])

  const columns = [
    { field: 'cont_fio', headerName: 'ФИО', width: 350, editable: true },
    { field: 'cont_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'cont_email', headerName: 'Email', width: 150, editable: true },
    { field: 'cont_tel1', headerName: 'Телефон 1', width: 150, editable: true },
    { field: 'cont_tel2', headerName: 'Телефон 2', width: 150, editable: true },
    { field: 'cont_tel3', headerName: 'Телефон 3', width: 150, editable: true },
  ]

  const fieldToFocus = 'cont_fio'
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
