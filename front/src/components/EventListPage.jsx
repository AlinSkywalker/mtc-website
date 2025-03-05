import React from 'react'
import { useFetchEventList } from '../queries/event'
import { useFetchMemberList } from '../queries/member'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from './EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from './dataGridCell/SelectEditInputCell'
import { EditCascadeSelectMenu } from './dataGridCell/EditCascadeSelectMenu'
import { dateColumnType } from './dataGridCell/GridEditDateCell'
import { MultiValueSelecWithGroupingtEditInputCell } from './dataGridCell/MultiValueSelecWithGroupingtEditInputCell'

const defaultItem = {
  event_name: '',
  event_base: '',
  event_start: '',
  event_finish: '',
  event_st: '',
  event_ob: '',
  event_desc: '',
  ob_fio: '',
  st_fio: '',
  base_name: '',
  price: null,
}

const validationSchema = Yup.object({
  event_name: Yup.string().required('Поле обязательно для заполнения'),
  event_start: Yup.string().required('Поле обязательно для заполнения'),
  event_finish: Yup.string().required('Поле обязательно для заполнения'),
  ob_fio: Yup.string()
    .required('Поле обязательно для заполнения')
    .notOneOf([Yup.ref('st_fio'), null], 'ОБ не может быть СТ'),
  st_fio: Yup.string()
    .required('Поле обязательно для заполнения')
    .notOneOf([Yup.ref('ob_fio'), null], 'ОБ не может быть СТ'),
  rai_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventListPage = () => {
  const { isLoading, data } = useFetchEventList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClickName = (id) => () => {
    navigate(`/admin/event/${id}`)
  }
  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/eventList', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['eventList'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${id}`, postedData)
  }, [])

  const renderBaseSelectEditCell = (params) => {
    return (
      <EditCascadeSelectMenu
        {...params}
        finishDictionary='districtDictionary'
        nameField='event_raion'
        displayField='rai_name'
      />
    )
  }
  const renderRaionSelectEditCell = (params) => {
    return (
      <MultiValueSelecWithGroupingtEditInputCell
        {...params}
        dictionaryName='districtDictionary'
        nameListField='raion_name_list'
        idListField='raion_id_list'
        displayNameField='raion_name'
        groupByField='region_name'
        labelField='rai_name'
      />
    )
  }

  const renderSTSelectEditCell = (params) => {
    const hookParams = { possibleRole: 'st' }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='event_st'
        hook={useFetchMemberList}
        hookParams={hookParams}
      />
    )
  }
  const renderOBSelectEditCell = (params) => {
    const hookParams = { possibleRole: 'ob' }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='event_ob'
        hook={useFetchMemberList}
        hookParams={hookParams}
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
      field: 'event_name',
      headerName: 'Название',
      width: 150,
      renderCell: renderLink,
      editable: true,
    },
    { field: 'event_desc', headerName: 'Описание', width: 350, editable: true },
    {
      field: 'event_start',
      ...dateColumnType,
      headerName: 'Дата начала',
      width: 150,
      editable: true,
    },
    {
      field: 'event_finish',
      ...dateColumnType,
      headerName: 'Дата окончания',
      width: 150,
      editable: true,
      minDate: 'event_start',
    },
    // {
    //   field: 'rai_name',
    //   headerName: 'Район проведения',
    //   width: 150,
    //   renderEditCell: renderBaseSelectEditCell,
    //   editable: true,
    // },
    {
      field: 'raion_name',
      headerName: 'Район проведения',
      width: 250,
      renderEditCell: renderRaionSelectEditCell,
      editable: true,
    },
    {
      field: 'st_fio',
      headerName: 'Старший тренер',
      width: 150,
      renderEditCell: renderSTSelectEditCell,
      editable: true,
    },
    {
      field: 'ob_fio',
      headerName: 'ОБ',
      width: 150,
      renderEditCell: renderOBSelectEditCell,
      editable: true,
    },
    { field: 'price', headerName: 'Цена мероприятия', width: 150, editable: true, type: 'number' },
    { field: 'event_raion', headerName: 'event_raion', width: 0, editable: true },
    { field: 'event_st', headerName: 'event_st', width: 0, editable: true },
    { field: 'event_ob', headerName: 'event_ob', width: 0, editable: true },
    { field: 'raion_id_list', headerName: 'raion_id_list', width: 0, editable: true },
    { field: 'raion_name_list', headerName: 'raion_name_list', width: 0, editable: true },
  ]
  const fieldToFocus = 'event_name'
  const columnVisibilityModel = {
    event_raion: false,
    event_st: false,
    event_ob: false,
    raion_id_list: false,
    raion_name_list: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['eventList'] })
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
