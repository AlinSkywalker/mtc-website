import React from 'react'
import { useFetchMemberLabaAscentList, useFetchMemberSportCategoryList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { GridEditInputCell } from '@mui/x-data-grid'

const defaultItem = {
  ascent_date: '',
  laba_name: '',
  ascent_belay: 'Нижняя',
  ascent_type: 'Онсайт',
}

const validationSchema = Yup.object({
  ascent_date: Yup.string().required('Поле обязательно для заполнения'),
  laba_name: Yup.string().required('Поле обязательно для заполнения'),
  ascent_belay: Yup.string().required('Поле обязательно для заполнения'),
  ascent_type: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberLabaAscentTab = ({ memberId }) => {
  // const readOnly = !useIsAdmin()
  const readOnly = true
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchMemberLabaAscentList(memberId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/memberList/${memberId}/labaAscent`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${memberId}/labaAscent/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'labaAscent'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${memberId}/labaAscent/${id}`, postedData)
  }, [])

  const columns = [
    {
      field: 'ascent_date',
      ...dateColumnType,
      headerName: 'дата',
      width: 120,
      editable: !readOnly,
    },
    {
      field: 'laba_name',
      headerName: 'Лаборатория',
      width: 180,
      editable: !readOnly,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'labatr_name',
      headerName: 'Трасса',
      width: 180,
      editable: !readOnly,
    },
    {
      field: 'labatr_sl',
      headerName: 'Сложность',
      width: 100,
      editable: !readOnly,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'ascent_belay',
      headerName: 'Страховка',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Верхняя', 'Нижняя'],
    },
    {
      field: 'ascent_type',
      headerName: 'Тип пролаза',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Онсайт', 'Флеш', 'Редпоинт'],
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
      readOnly={readOnly}
    />
  )
}
