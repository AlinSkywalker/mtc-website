import React from 'react'
import { useFetchLaboratoryDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from './SelectEditInputCell'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  laba_rai: '',
  laba_desk: '',
  laba_name: '',
  rai_name: '',
}

export const LaboratoryDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchLaboratoryDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    // console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.put('/api/laboratoryDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/laboratoryDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/laboratoryDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='districtDictionary' nameField='rai_name' />
    )
  }

  const columns = [
    { field: 'laba_name', headerName: 'Название', width: 350, editable: true },
    { field: 'laba_desk', headerName: 'Описание', width: 350, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    {
      field: 'laba_rai',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.rai_name
        return <>{displayValue}</>
      },
    },
  ]

  const fieldToFocus = 'laba_name'
  const columnVisibilityModel = {
    rai_name: false,
  }

  const processRowUpdate = (newRow) => {
    // console.log('processRowUpdate')
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
