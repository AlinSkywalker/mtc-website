import React from 'react'
import { useFetchRouteDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditCascadeSelectMenu } from '../dataGridCell/EditCascadeSelectMenu'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'

const defaultItem = {
  rout_mount: '',
  rout_desc: '',
  rout_per: '',
  rout_sup: '',
  rout_tip: '',
  rout_comp: '',
  rout_name: '',
  mount_name: '',
  rout_winter: 0,
}

const validationSchema = Yup.object({
  rout_mount: Yup.string().required('Поле обязательно для заполнения'),
  rout_name: Yup.string().required('Поле обязательно для заполнения'),
  rout_comp: Yup.string().required('Поле обязательно для заполнения'),
  rout_tip: Yup.string().required('Поле обязательно для заполнения'),
  rout_winter: Yup.number().required('Поле обязательно для заполнения'),
})

export const RouteDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchRouteDictionaryList()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/routeDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/routeDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/routeDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    return (
      <EditCascadeSelectMenu
        {...params}
        finishDictionary='summitDictionary'
        nameField='rout_mount'
        displayField='mount_name'
      />
    )
  }
  const columns = [
    {
      field: 'mount_name',
      headerName: 'Вершина',
      width: 250,
      editable: true,
      renderEditCell: renderSelectEditCell,
    },
    { field: 'rout_name', headerName: 'Название', width: 350, editable: true },
    {
      field: 'rout_comp',
      headerName: 'КС',
      width: 80,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б'],
    },
    {
      field: 'rout_tip',
      headerName: 'Тип',
      width: 80,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['ск', 'к', 'лс'],
    },
    {
      field: 'rout_winter',
      headerName: 'Зимний',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    { field: 'rout_sup', headerName: 'Руководитель', width: 150, editable: true },
    { field: 'rout_per', headerName: 'Год', width: 100, editable: true },
    { field: 'rout_desc', headerName: 'Описание', width: 250, editable: true },
    { field: 'rout_mount', headerName: 'rout_mount', width: 0, editable: true },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    { field: 'mount_rai', headerName: 'mount_rai', width: 0, editable: true },
  ]

  const fieldToFocus = 'rout_name'
  const columnVisibilityModel = {
    rout_mount: false,
    region_name: false,
    rai_reg: false,
    rai_name: false,
    mount_rai: false,
    // mount_name: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
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
