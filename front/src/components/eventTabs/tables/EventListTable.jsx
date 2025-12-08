import React, { useState } from 'react'
import { useFetchEventList } from '../../../queries/event'
import { useFetchMemberList } from '../../../queries/member'
import { Link, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../../dataGridCell/SelectEditInputCell'
import { dateColumnType } from '../../dataGridCell/GridEditDateCell'
import { MultiValueSelecWithGroupingtEditInputCell } from '../../dataGridCell/MultiValueSelecWithGroupingtEditInputCell'
import { useIsAdmin } from '../../../hooks/useIsAdmin'

const defaultItem = {
  event_name: '',
  event_base: '',
  event_start: '',
  event_finish: '',
  event_st: '',
  event_ob: '',
  event_doctor: '',
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
  // rai_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventListTable = () => {
  const [show, setShow] = useState('future')
  const readOnly = !useIsAdmin()
  const { isLoading, data } = useFetchEventList(show)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClickName = (id) => () => {
    navigate(`/crm/event/${id}/`)
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
  const renderOrganizerSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='event_organizer'
        hook={useFetchMemberList}
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
      editable: !readOnly,
    },
    { field: 'event_desc', headerName: 'Описание', width: 350, editable: !readOnly },
    {
      field: 'event_start',
      ...dateColumnType,
      headerName: 'Дата начала',
      width: 150,
      editable: !readOnly,
    },
    {
      field: 'event_finish',
      ...dateColumnType,
      headerName: 'Дата окончания',
      width: 150,
      editable: !readOnly,
      minDate: 'event_start',
    },
    {
      field: 'raion_name',
      headerName: 'Район проведения',
      width: 250,
      renderEditCell: renderRaionSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'st_fio',
      headerName: 'Старший тренер',
      width: 150,
      renderEditCell: renderSTSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'ob_fio',
      headerName: 'ОБ',
      width: 150,
      renderEditCell: renderOBSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'organizer_fio',
      headerName: 'Организатор',
      width: 150,
      renderEditCell: renderOrganizerSelectEditCell,
      editable: !readOnly,
    },

    {
      field: 'price',
      headerName: 'Инструкторский сбор',
      width: 150,
      editable: !readOnly,
      type: 'number',
    },
    { field: 'event_raion', headerName: 'event_raion', width: 0, editable: !readOnly },
    { field: 'event_st', headerName: 'event_st', width: 0, editable: !readOnly },
    { field: 'event_ob', headerName: 'event_ob', width: 0, editable: !readOnly },
    { field: 'event_organizer', headerName: 'event_organizer', width: 0, editable: !readOnly },
    { field: 'raion_id_list', headerName: 'raion_id_list', width: 0, editable: !readOnly },
    { field: 'raion_name_list', headerName: 'raion_name_list', width: 0, editable: !readOnly },
  ]
  const fieldToFocus = 'event_name'
  const columnVisibilityModel = {
    event_raion: false,
    event_st: false,
    event_ob: false,
    event_organizer: false,
    raion_id_list: false,
    raion_name_list: false,
  }

  const processRowUpdate = async (newRow, oldRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    if (
      oldRow?.event_start !== newRow.event_start ||
      oldRow?.event_finish !== newRow.event_finish
    ) {
      newRow = { ...newRow, isDatesChanged: true }
    }
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['eventList'] })
  }
  const handleChangeShow = (event, show) => {
    if (show) {
      setShow(show)
    }
  }

  const rightPanel = (
    <>
      <ToggleButtonGroup
        value={show}
        exclusive
        onChange={handleChangeShow}
        aria-label='text alignment'
      >
        <ToggleButton value='future' aria-label='left aligned'>
          Будущие
        </ToggleButton>
        <ToggleButton value='past' aria-label='centered'>
          Прошедшие
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )

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
        (params.field !== 'st_fio' && params.field !== 'ob_fio') ||
        (params.row.isNew && (params.field == 'st_fio' || params.field == 'ob_fio'))
      }
      readOnly={readOnly}
      rightPanel={rightPanel}
    />
  )
}
