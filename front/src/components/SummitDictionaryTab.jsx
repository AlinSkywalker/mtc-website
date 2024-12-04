import React from 'react'
import { useFetchSummitDictionaryList } from '../queries/dictionary'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'
import { SelectEditInputCell } from './SelectEditInputCell'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  mount_rai: '',
  mount_desc: '',
  mount_height: '',
  mount_name: '',
  rai_name: '',
}

export const SummitDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchSummitDictionaryList()

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
    apiClient.put('/api/summitDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/summitDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/summitDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
    })
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='districtDictionary' nameField='rai_name' />
    )
  }

  const columns = [
    { field: 'mount_name', headerName: 'Название', width: 250, editable: true },
    { field: 'mount_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'mount_height', headerName: 'Высота', width: 100, editable: true, type: 'number' },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    {
      field: 'mount_rai',
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

  const fieldToFocus = 'mount_name'
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
