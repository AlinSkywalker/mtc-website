import React from 'react'
import { useFetchMemberList } from '../queries/member'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../components/EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../components/dataGridCell/SelectEditInputCell'
import { dateColumnType } from '../components/dataGridCell/GridEditDateCell'
import { sizeClothOptions, sizeShoeOptions } from '../constants'
import { checkboxColumnType } from '../components/dataGridCell/GridEditCheckboxCell'

const defaultItem = {
  fio: '',
  gender: '',
  memb_city: '',
  name_city: '',
  tel_1: '',
  tel_2: '',
  memb_email: '',
  size_cloth: '?',
  size_shoe: '?',
  date_birth: '',
  memb: 0,
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
  gender: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberListPage = () => {
  const { isLoading, data } = useFetchMemberList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClickName = (id) => () => {
    navigate(`/admin/member/${id}`)
  }
  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/memberList', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['memberList'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${id}`, postedData)
  }, [])

  const renderCitySelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='cityDictionary'
        nameField='memb_city'
        secondarySourceArray={['count_name', 'okr_name', 'sub_name']}
      />
    )
  }

  const renderLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickName(params.row.id)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }
  const columns = [
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderLink,
      editable: true,
    },
    {
      field: 'gender',
      headerName: 'Пол',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['М', 'Ж'],
    },
    {
      field: 'date_birth',
      ...dateColumnType,
      headerName: 'Дата рождения',
      width: 150,
      editable: true,
    },
    {
      field: 'name_city',
      headerName: 'Город',
      width: 150,
      editable: true,
      renderEditCell: renderCitySelectEditCell,
    },
    { field: 'memb_email', headerName: 'Email', width: 150, editable: true },
    { field: 'tel_1', headerName: 'Телефон', width: 150, editable: true },
    { field: 'tel_2', headerName: 'Телефон доп', width: 150, editable: true },
    {
      field: 'size_cloth',
      headerName: 'Размер одежды',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: sizeClothOptions,
    },
    {
      field: 'size_shoe',
      headerName: 'Размер обуви',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: sizeShoeOptions,
    },
    {
      field: 'memb',
      headerName: 'Член клуба',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    { field: 'memb_city', headerName: 'memb_city', width: 0, editable: true },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {
    memb_city: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['memberList'] })
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
