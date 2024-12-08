import React from 'react'
import { useFetchSummitDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from '../SelectEditInputCell'
import { EditableTable } from '../EditableTable'
import { DistrictSelectMenu } from '../DistrictSelectMenu'
import * as Yup from 'yup'

const defaultItem = {
  mount_rai: '',
  mount_desc: '',
  mount_height: '',
  mount_name: '',
  rai_name: '',
}

const validationSchema = Yup.object({
  mount_rai: Yup.string().required('Поле обязательно для заполнения'),
  mount_name: Yup.string().required('Поле обязательно для заполнения'),
})

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
    return apiClient.put('/api/summitDictionary', postedData)
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
    return apiClient.post(`/api/summitDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <DistrictSelectMenu {...params} dictionaryName='districtDictionary' nameField='mount_rai' />
    )
  }

  const columns = [
    { field: 'mount_name', headerName: 'Название', width: 250, editable: true },
    { field: 'mount_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'mount_height', headerName: 'Высота', width: 100, editable: true, type: 'number' },
    { field: 'mount_rai', headerName: 'mount_rai', width: 0, editable: true },
    {
      field: 'rai_name',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
    },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
  ]

  const fieldToFocus = 'mount_name'
  const columnVisibilityModel = {
    mount_rai: false,
    region_name: false,
    rai_reg: false,
  }

  const processRowUpdate = (newRow) => {
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
      const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
      handleSave(newRow)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
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
