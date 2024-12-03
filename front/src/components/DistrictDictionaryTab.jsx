import React from 'react'
import { useFetchDistrictDictionaryList } from '../queries/dictionary'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from './SelectEditInputCell'
import * as Yup from 'yup'
import { DictionaryEditableTable } from './DictionaryEditableTable'

const defaultDictionaryItem = {
  rai_reg: '',
  rai_num: '',
  rai_name: '',
  rai_desc: '',
  region_name: '',
}

const validationSchema = Yup.object({
  rai_reg: Yup.string().required('Поле Регион обязательно для заполнения'),
  rai_num: Yup.string().required('Поле Номер обязательно для заполнения'),
  rai_name: Yup.string().required('Поле Название обязательно для заполнения'),
})

export const DistrictDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchDistrictDictionaryList()

  const [rows, setRows] = React.useState([])
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
  const fieldToFocus = 'rai_name'
  const columnVisibilityModel = {
    region_name: false,
  }

  const processRowUpdate = (newRow) => {
    // console.log('processRowUpdate')
    // сначала надо провалидировать строку
    // если все норм - пойдем сохранять
    // если что-то не так надо вывести ошибку и НЕ сохранять на бэк
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
      //   console.log(resultRow)
      const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
      handleSave(newRow)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ['districtDictionary'] })
          const updatedRow = { ...newRow, isNew: false, error: false }
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
          resultRow = updatedRow
        })
        .catch((e) => {
          // ошибка с бэка - надо как то вывести, и оно видимо не сохранилось
          const errorRow = { ...newRow, error: true }
          setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
          resultRow = errorRow
        })
    } catch (e) {
      const errors = e.inner.map((item) => ({ path: item.path, message: item.message }))
      // console.log(errors)
      const errorRow = { ...newRow, error: true, errors }
      setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
      resultRow = errorRow
    }
    // console.log('after try')
    return resultRow
  }
  // console.log('columns1', columns)
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
