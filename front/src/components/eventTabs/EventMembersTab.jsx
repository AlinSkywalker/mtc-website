import React from 'react'
import { useFetchEventMemberList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GridEditInputCell } from '@mui/x-data-grid'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'

const defaultItem = {
  eventmemb_memb: '',
  eventmemb_nstrah: 0,
  eventmemb_nmed: 0,
  eventmemb_dates: '',
  eventmemb_datef: '',
  fio: '',
  eventmemb_gen: '',
  eventmemb_nom: '',
  ventmemb_pred: '',
  eventmemb_opl: '',
  eventmemb_role: 'Участник',
  alerts: [],
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventMembersTab = ({ eventId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventMemberList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  const navigate = useNavigate()

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/member`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/member/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'member'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/member/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    const pickMap = {
      gender: 'gender',
      tel_1: 'tel_1',
      memb_email: 'memb_email',
      size_cloth: 'size_cloth',
      size_shoe: 'size_shoe',
      name_city: 'name_city',
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='eventmemb_memb'
        hook={useFetchMemberList}
        pickMap={pickMap}
        secondarySource='alprazr'
        secondarySourceArray={['alprazr', 'skali', 'ledu']}
      />
    )
  }
  const handleClickName = (id) => () => {
    navigate(`/admin/member/${id}`)
  }
  const renderLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickName(params.row.eventmemb_memb)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }
  const renderAlerts = (params) => {
    const alerts = params.value ?? []
    if (alerts.length !== 0) {
      const tooltipText = alerts.join(';')
      return (
        <Tooltip title={tooltipText}>
          <IconButton sx={{ marginLeft: 1, color: red[500] }}>
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )
    } else {
      return params.value
    }
  }

  const columns = [
    {
      field: 'alerts',
      renderCell: renderAlerts,
      width: 80,
      headerName: '',
    },
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderLink,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    {
      field: 'eventmemb_dates',
      ...dateColumnType,
      headerName: 'Дата заезда',
      width: 120,
      editable: true,
    },
    {
      field: 'eventmemb_datef',
      ...dateColumnType,
      headerName: 'Дата выезда',
      width: 120,
      editable: true,
      minDate: 'eventmemb_dates',
    },
    { field: 'eventmemb_memb', headerName: 'eventmemb_memb', width: 0, editable: true },
    {
      field: 'eventmemb_nstrah',
      headerName: 'Страховка',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'eventmemb_nmed',
      headerName: 'Справка',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'eventmemb_role',
      headerName: 'Роль',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Участник', 'Инструктор', 'Волонтёр'],
    },
    {
      field: 'eventmemb_pred',
      headerName: 'Предоплата',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'eventmemb_opl',
      headerName: 'Оплата',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'eventmemb_gen',
      headerName: 'Проживание по полу',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'gender',
      headerName: 'Пол',
      width: 80,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'tel_1',
      headerName: 'Телефон',
      width: 150,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'memb_email',
      headerName: 'email',
      width: 150,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    // { field: 'size_cloth', headerName: 'Размер одежды', width: 150 },
    // { field: 'size_shoe', headerName: 'Размер обуви', width: 150 },
    // { field: 'name_city', headerName: 'Город', width: 150 },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {
    eventmemb_memb: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'member'] })
  }

  if (!eventId) return null
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
