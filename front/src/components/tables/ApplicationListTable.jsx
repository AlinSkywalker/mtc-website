import React from 'react'
import { useFetchMemberList } from '../../queries/member'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { sizeClothOptions, sizeShoeOptions } from '../../constants'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { useFetchApplicationList } from '../../queries/application'

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

export const ApplicationListTable = () => {
  const { isLoading, data } = useFetchApplicationList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClickName = (id) => () => {
    navigate(`/admin/member/${id}`)
  }

  const handleClickEvent = (id) => () => {
    navigate(`/admin/event/${id}`)
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
  const renderEventLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickEvent(params.row.id)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }

  const renderMemberLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickName(params.row.id)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }
  const columns = [
    {
      field: 'event_name',
      headerName: 'Мероприятие',
      width: 250,
      renderCell: renderEventLink,
      editable: true,
    },
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderMemberLink,
      editable: true,
    },
    {
      field: 'date_start',
      ...dateColumnType,
      headerName: 'Дата заезда',
      width: 150,
      editable: true,
    },
    {
      field: 'date_finish',
      ...dateColumnType,
      headerName: 'Дата отъезда',
      width: 150,
      editable: true,
    },
    {
      field: 'depart_tip',
      headerName: 'Тип отделения',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['НП', 'СП', 'СС', 'СМ'],
    },
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
