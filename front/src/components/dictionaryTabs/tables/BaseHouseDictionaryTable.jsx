import React from 'react'
import { useFetchBaseHouseDictionaryList } from '../../../queries/dictionary'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import Typography from '@mui/material/Typography'
import { checkboxColumnType } from '../../dataGridCell/GridEditCheckboxCell'

const defaultItem = {
  basefd_name: '',
  basefd_stol: '0',
  basefd_kuh: '',
}

const validationSchema = Yup.object({
  basefd_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const BaseHouseDictionaryTable = ({ onRowSelectionModelChange, selectedBase }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchBaseHouseDictionaryList(selectedBase)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/baseHouseDictionary', {
      ...postedData,
      basefd_base: selectedBase,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/baseHouseDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseHouseDictionary', selectedBase] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/baseHouseDictionary/${id}`, postedData)
  }, [])

  const columns = [
    { field: 'basefd_name', headerName: 'Корпус и т.п.', width: 250, editable: true },
    {
      field: 'basefd_stol',
      headerName: 'Столовая',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'basefd_kuh',
      headerName: 'Кухня',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
  ]

  const fieldToFocus = 'basefd_name'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['baseHouseDictionary', selectedBase] })
  }

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Жилой фонд базы
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
        onRowSelectionModelChange={onRowSelectionModelChange}
        addButtonDisabled={!selectedBase}
        showPagination={false}
      />
    </>
  )
}
