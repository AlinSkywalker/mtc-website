import React from 'react'
import { useFetchBaseDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from './SelectEditInputCell'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  base_rai: '',
  rai_name: '',
  base_name: '',
  base_adres: '',
  base_desc: '',
  base_cont: '',
  cont_fio: '',
  base_sait: '',
}

export const BaseDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchBaseDictionaryList()

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
    apiClient.put('/api/baseDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/baseDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/baseDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
    })
  }, [])

  const renderContractorSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='contractorDictionary' nameField='cont_fio' />
    )
  }
  const renderDistrictSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='districtDictionary' nameField='rai_name' />
    )
  }

  const columns = [
    { field: 'base_name', headerName: 'Название', width: 350, editable: true },
    { field: 'base_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'base_adres', headerName: 'Адрес', width: 150, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    { field: 'cont_fio', headerName: 'cont_fio', width: 0, editable: true },
    {
      field: 'base_cont',
      headerName: 'Контрагент',
      width: 350,
      editable: true,
      renderEditCell: renderContractorSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.cont_fio
        return <>{displayValue}</>
      },
    },
    {
      field: 'base_rai',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderDistrictSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.rai_name
        return <>{displayValue}</>
      },
    },
    { field: 'base_sait', headerName: 'Сайт', width: 150, editable: true },
  ]

  const fieldToFocus = 'base_name'
  const columnVisibilityModel = {
    rai_name: false,
    cont_fio: false,
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
