import React from 'react'
import { useFetchLaboratoryRouteDictionaryList } from '../../../queries/dictionary'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import { multilineColumnType } from '../../dataGridCell/GridEditMultilineCell'

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
      valueOptions: ['Скала', 'Лед', 'Микст', 'Драйтул', 'ИТО', 'Теория', 'Практика'],
    },
    {
      field: 'labatr_sl',
      headerName: 'Сложность',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        if (!row) {
          // The row is not available when filtering this column
          return []
        }
        let values = []
        if (row.labatr_typ === 'Скала') {
          values = [
            '4a',
            '4b',
            '4c',
            '4c+',
            '5a',
            '5a+',
            '5b',
            '5b+',
            '5c',
            '5c+',
            '6a',
            '6a+',
            '6b',
            '6b+',
            '6c',
            '6c+',
            '7a',
            '7a+',
            '7b',
            '7b+',
            '7c',
            '7c+',
            '8a',
            '8a+',
            '8b',
            '8b+',
            '8c',
            '8c+',
          ]
        } else if (row.labatr_typ === 'Лед') {
          values = ['WI2', 'WI3', 'WI4', 'WI5', 'WI6', 'WI7']
        } else if (row.labatr_typ === 'Микст') {
          values = ['M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']
        } else if (row.labatr_typ === 'Драйтул') {
          values = []
        } else if (row.labatr_typ === 'ИТО') {
          values = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5']
        } else if (row.labatr_typ === 'Теория' || row.labatr_typ === 'Практика') {
          values = ['СО', 'НП', 'УТ', 'СС', 'СМ']
        }
        return values
      },
    },
    { field: 'labatr_dl', headerName: 'Протяженность', width: 100, editable: true, type: 'number' },
    {
      field: 'labatr_kolb',
      headerName: 'Количество оттяжек',
      width: 150,
      editable: true,
      type: 'number',
    },
    {
      field: 'labatr_desk',
      headerName: 'Описание',
      width: 300,
      editable: true,
      ...multilineColumnType,
    },
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
