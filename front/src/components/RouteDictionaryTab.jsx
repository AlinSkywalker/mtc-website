import React from 'react'
import { useFetchRouteDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from './SelectEditInputCell'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  rout_mount: '',
  rout_desc: '',
  rout_per: '',
  rout_sup: '',
  rout_tip: '',
  rout_comp: '',
  rout_name: '',
  mount_name: '',
}

export const RouteDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchRouteDictionaryList()

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
    apiClient.put('/api/routeDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/routeDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/routeDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='summitDictionary' nameField='mount_name' />
    )
  }

  const columns = [
    { field: 'rout_name', headerName: 'Название', width: 350, editable: true },
    {
      field: 'rout_comp',
      headerName: 'Сложность',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б'],
    },
    {
      field: 'rout_tip',
      headerName: 'Характер',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['ск', 'к', 'лс'],
    },
    { field: 'rout_sup', headerName: 'Руководитель', width: 350, editable: true },
    { field: 'rout_per', headerName: 'Год прохождения', width: 100, editable: true },
    { field: 'rout_desc', headerName: 'Описание', width: 150, editable: true },
    { field: 'mount_name', headerName: 'mount_name', width: 0, editable: true },
    {
      field: 'rout_mount',
      headerName: 'Вершина',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.mount_name
        return <>{displayValue}</>
      },
    },
  ]

  const fieldToFocus = 'rout_name'
  const columnVisibilityModel = {
    mount_name: false,
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
