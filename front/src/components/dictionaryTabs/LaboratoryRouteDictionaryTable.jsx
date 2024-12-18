import React from 'react'
import { useFetchLaboratoryRouteDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import Typography from '@mui/material/Typography'

const defaultItem = {
  labatr_name: '',
  labatr_typ: '',
  labatr_sl: '',
  labatr_dl: '',
  labatr_kolb: '',
  labatr_desk: '',
}

const validationSchema = Yup.object({
  labatr_name: Yup.string().required('Поле обязательно для заполнения'),
  labatr_typ: Yup.string().required('Поле обязательно для заполнения'),
  labatr_sl: Yup.string().required('Поле обязательно для заполнения'),
  labatr_dl: Yup.number().required('Поле обязательно для заполнения'),
  labatr_kolb: Yup.number().required('Поле обязательно для заполнения'),
})

export const LaboratoryRouteDictionaryTable = ({ selectedLaboratory }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchLaboratoryRouteDictionaryList(selectedLaboratory)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/laboratoryRouteDictionary', {
      ...postedData,
      labatr_lab: selectedLaboratory,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/laboratoryRouteDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryRouteDictionary', selectedLaboratory] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/laboratoryRouteDictionary/${id}`, postedData)
  }, [])

  const columns = [
    { field: 'labatr_name', headerName: 'Наименование', width: 250, editable: true },
    {
      field: 'labatr_typ',
      headerName: 'Тип',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Скала', 'Лед', 'Микст', 'Драйтул'],
    },
    { field: 'labatr_sl', headerName: 'Сложность', width: 100, editable: true },
    { field: 'labatr_dl', headerName: 'Протяженность', width: 100, editable: true, type: 'number' },
    {
      field: 'labatr_kolb',
      headerName: 'Количество оттяжек',
      width: 150,
      editable: true,
      type: 'number',
    },
    { field: 'labatr_desk', headerName: 'Описание', width: 100, editable: true },
  ]

  const fieldToFocus = 'labatr_name'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['laboratoryRouteDictionary', selectedLaboratory] })
  }

  return (
    <>
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
      />
    </>
  )
}
