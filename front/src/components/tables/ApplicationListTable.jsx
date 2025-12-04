import React from 'react'
import { useFetchMemberList } from '../../queries/member'
import { Button, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { DEPARTMENT_TYPE_ARRAY, sizeClothOptions, sizeShoeOptions } from '../../constants'
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
    return apiClient.put('/api/applicationList', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/applicationList/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['applicationList'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/applicationList/${id}`, postedData)
  }, [])

  const renderEventLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickEvent(params.row.event)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }

  const renderMemberLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickName(params.row.member)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }
  const handleAcceptApplication = (id) => () => {
    apiClient.post(`/api/applicationList/${id}/accept`).then((res) => {
      queryClient.invalidateQueries({
        queryKey: ['applicationList'],
      })
    })
  }

  const renderAcceptButtonCell = (params) => {
    const buttonElement = React.useRef(null)

    if (!params.row.accepted) {
      return (
        <Button
          size='small'
          variant='contained'
          onClick={handleAcceptApplication(params.row.id)}
          ref={buttonElement}
        >
          Принять
        </Button>
      )
    }
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
      field: 'department_type',
      headerName: 'Тип отделения',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: DEPARTMENT_TYPE_ARRAY,
    },
    {
      field: 'accept_day',
      headerName: '',
      width: 125,
      renderCell: renderAcceptButtonCell,
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
