import React from 'react'
import { useFetchMemberSportCategoryList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'

const defaultItem = {
  type: '',
  date_pr: '',
  ball: '',
}

const validationSchema = Yup.object({
  type: Yup.string().required('Поле обязательно для заполнения'),
  date_pr: Yup.string().required('Поле обязательно для заполнения'),
  ball: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberSportCategoryTab = ({ memberId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchMemberSportCategoryList(memberId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/memberList/${memberId}/sportCategory`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${memberId}/sportCategory/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'sportCategory'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${memberId}/sportCategory/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'type',
      headerName: 'Тип',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Разряд', 'Судья', 'Инструктор'],
    },
    {
      field: 'date_pr',
      ...dateColumnType,
      headerName: 'Дата присвоения',
      width: 120,
      editable: true,
    },
    {
      field: 'ball',
      headerName: 'Разряд/Категория',
      width: 200,
      editable: true,
    },
  ]
  const fieldToFocus = 'type'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['member', memberId, 'sportCategory'] })
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
    />
  )
}
