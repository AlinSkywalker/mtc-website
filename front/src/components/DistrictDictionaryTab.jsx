import React from 'react'
import { useFetchDistrictDictionaryList } from '../queries/dictionary'
import {
  DataGrid,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'
import { SelectEditInputCell } from './SelectEditInputCell'
// import * as Yup  from 'yup'
import {ActionsCellItem} from './ActionsCellItem'
import {DictionaryEditableTable} from './DictionaryEditableTable'


const defaultDictionaryItem = {
  rai_reg: '',
  rai_num: '',
  rai_name: '',
  rai_desc: '',
  region_name: '',
}

// const validationSchema = Yup.object({
//   rai_reg: Yup.string().required(),
//   rai_num: Yup.string().required(),
//   rai_name: Yup.string().required(),
//   rai_desc: Yup.string().required(),
// });

export const DistrictDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchDistrictDictionaryList()

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
    return apiClient.put('/api/districtDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/districtDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['districtDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    return apiClient.post(`/api/districtDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='regionDictionary' nameField='region_name' />
    )
  }

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
        return <ActionsCellItem 
          isInEditMode={isInEditMode} 
          handleSaveClick={handleSaveClick} 
          handleCancelClick={handleCancelClick}
          handleEditClick={handleEditClick}
          handleDeleteItem={handleDeleteItem}/>
      },
    },
    { field: 'rai_name', headerName: 'Название', width: 350, editable: true },
    { field: 'rai_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'rai_num', headerName: 'Номер', width: 150, editable: true },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    {
      field: 'rai_reg',
      headerName: 'Регион',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      renderCell: (params) => {
        const displayValue = params.row.region_name
        return <>{displayValue}</>
      },
    },
  ]

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = (newRow) => {
    // console.log('processRowUpdate')
    // сначала надо провалидировать строку
    // если все норм - пойдем сохранять
    // если что-то не так надо вывести ошибку и НЕ сохранять на бэк

    // const isValid = validationSchema.isValid(newRow)
    // if(!isValid){
    //   // что-то для индикации ошибки

    //   // возвращаем строку обратно
    //   const errorRow = { ...newRow, error: true }
    //   return errorRow
    // }

    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    handleSave(newRow).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['districtDictionary'] })
      const updatedRow = { ...newRow, isNew: false }
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      return updatedRow
    }).catch(e=>{
      // ошибка с бэка - надо как то вывести, и оно видимо не сохранилось
      const errorRow = { ...newRow, error: true }
      return errorRow
    })
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
    />
  )
}
