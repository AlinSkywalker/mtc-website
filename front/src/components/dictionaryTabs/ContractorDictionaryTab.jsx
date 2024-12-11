import React from 'react'
import { useFetchContractorDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'

const defaultItem = {
  cont_fio: '',
  cont_desc: '',
  cont_email: '',
  cont_tel3: '',
  cont_tel2: '',
  cont_tel1: '',
  cont_zan: '',
}

const validationSchema = Yup.object({
  cont_fio: Yup.string().required('Поле обязательно для заполнения'),
  cont_zan: Yup.string().required('Поле обязательно для заполнения'),
})

export const ContractorDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchContractorDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/contractorDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/contractorDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/contractorDictionary/${id}`, postedData)
  }, [])
  const columns = [
    { field: 'cont_fio', headerName: 'ФИО', width: 350, editable: true },
    { field: 'cont_desc', headerName: 'Описание', width: 350, editable: true },
    {
      field: 'cont_zan',
      headerName: 'Занятие',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Администратор', 'Водитель', 'Повар'],
    },
    { field: 'cont_email', headerName: 'Email', width: 150, editable: true },
    { field: 'cont_tel1', headerName: 'Телефон 1', width: 150, editable: true },
    { field: 'cont_tel2', headerName: 'Телефон 2', width: 150, editable: true },
    { field: 'cont_tel3', headerName: 'Телефон 3', width: 150, editable: true },
  ]

  const fieldToFocus = 'cont_fio'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
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
