import React from 'react'
import { useFetchDistrictDictionaryList, useFetchDictionaryByName } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
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
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/districtDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/districtDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['districtDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/districtDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    return <SelectEditInputCell {...params} dictionaryName='regionDictionary' nameField='rai_reg' />
  }

  const columns = [
    { field: 'rai_num', headerName: 'Номер', width: 150, editable: true },
    { field: 'rai_name', headerName: 'Название', width: 350, editable: true },
    { field: 'rai_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    {
      field: 'region_name',
      headerName: 'Регион',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
    },
  ]
  const fieldToFocus = 'rai_name'
  const columnVisibilityModel = {
    rai_reg: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['districtDictionary'] })
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
