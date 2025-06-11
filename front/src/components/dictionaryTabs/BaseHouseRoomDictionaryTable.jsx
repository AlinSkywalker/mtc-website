import React from 'react'
import { useFetchBaseHouseRoomDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import Typography from '@mui/material/Typography'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'

const defaultItem = {
  basenom_mest: '',
  basenom_ud: '',
  basenom_bal: '',
  basenom_sem: '',
  basenom_pod: '',
  basenom_prais: '',
  basenom_akt: '',
}

const validationSchema = Yup.object({
  basenom_mest: Yup.string().required('Поле обязательно для заполнения'),
  basenom_prais: Yup.string().required('Поле обязательно для заполнения'),
})

export const BaseHouseRoomDictionaryTable = ({ selectedBase, selectedBaseHouse }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchBaseHouseRoomDictionaryList(selectedBaseHouse)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/baseHouseRoomDictionary', {
      ...postedData,
      basenom_fd: selectedBaseHouse,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/baseHouseRoomDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseHouseRoomDictionary', selectedBaseHouse] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/baseHouseRoomDictionary/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'basenom_name',
      headerName: 'Название',
      width: 150,
      editable: true,
    },
    {
      field: 'basenom_mest',
      headerName: 'Мест',
      width: 80,
      editable: true,
      type: 'number',
    },
    {
      field: 'basenom_ud',
      headerName: 'Удобства',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['В номере', 'На этаже', 'На улице'],
    },
    {
      field: 'basenom_bal',
      headerName: 'Балкон',
      width: 80,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'basenom_sem',
      headerName: 'Семейный',
      width: 80,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'basenom_pod',
      headerName: 'Раскладушка',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    { field: 'basenom_prais', headerName: 'Цена', width: 90, editable: true, type: 'number' },
    {
      field: 'basenom_akt',
      ...dateColumnType,
      headerName: 'Актуальность',
      width: 120,
      editable: true,
    },
    {
      field: 'basenom_koi',
      headerName: 'По кроватно',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
  ]

  const fieldToFocus = 'base_name'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['baseHouseRoomDictionary', selectedBaseHouse] })
  }

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Номера в корпусах
      </Typography>
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
        height={600}
        addButtonDisabled={!selectedBaseHouse}
      />
    </>
  )
}
