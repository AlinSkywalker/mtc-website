import React from 'react'
import { useFetchDistrictDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from '../SelectEditInputCell'
import * as Yup from 'yup'
import { EditableTable } from '../EditableTable'

const defaultItem = {
  rai_reg: '',
  rai_num: '',
  rai_name: '',
  rai_desc: '',
  region_name: '',
}

const validationSchema = Yup.object({
  rai_reg: Yup.string().required('Поле обязательно для заполнения'),
  rai_num: Yup.string().required('Поле обязательно для заполнения'),
  rai_name: Yup.string().required('Поле обязательно для заполнения'),
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
    return <SelectEditInputCell {...params} dictionaryName='regionDictionary' nameField='rai_reg' />
  }

  const columns = [
    { field: 'rai_name', headerName: 'Название', width: 350, editable: true },
    { field: 'rai_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'rai_num', headerName: 'Номер', width: 150, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    {
      field: 'region_name',
      headerName: 'Регион',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      // renderCell: (params) => {
      //   const displayValue = params.row.region_name
      //   return <>{displayValue}</>
      // },
    },
  ]
  const fieldToFocus = 'rai_name'
  const columnVisibilityModel = {
    rai_reg: false,
  }

  const processRowUpdate = (newRow) => {
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
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
  // console.log('columns1', columns)
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
