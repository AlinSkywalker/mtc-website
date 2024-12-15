import React from 'react'
import { useFetchMemberExamList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'

const defaultItem = {
  zach_name: '',
  zach_note: '',
  zach_e2: '',
  zach_e1: '',
  zach_grade: '',
}

const validationSchema = Yup.object({
  zach_name: Yup.string().required('Поле обязательно для заполнения'),
  zach_grade: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberExamTab = ({ memberId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchMemberExamList(memberId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/memberList/${memberId}/exam`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${memberId}/exam/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'exam'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${memberId}/exam/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'zach_name',
      headerName: 'Зачет',
      width: 250,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        'Оказание доврачебной помощи',
        'Транспортировка подручными средствами',
        'Нормативные документы ФАР',
        'Проведение спасательных работ в малой группе',
      ],
    },
    {
      field: 'zach_grade',
      headerName: 'Оценка',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['3', '4', '5'],
    },
    {
      field: 'zach_e1',
      headerName: 'Экзаменатор 1',
      width: 200,
      editable: true,
    },
    {
      field: 'zach_e2',
      headerName: 'Экзаменатор 2',
      width: 200,
      editable: true,
    },
    { field: 'zach_note', headerName: 'Заметки', width: 350, editable: true },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['member', memberId, 'exam'] })
  }

  if (!memberId) return null
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
      isCellEditable={(params) =>
        params.field !== 'fio' || (params.row.isNew && params.field == 'fio')
      }
    />
  )
}
