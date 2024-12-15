import React from 'react'
import { useFetchSummitDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import { DistrictSelectMenu } from '../dataGridCell/DistrictSelectMenu'

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
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/summitDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/summitDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/summitDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
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

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['summitDictionary'] })
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
